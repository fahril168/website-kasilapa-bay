<?php
// ==============================================================================
// Kasilapa Bay - Automated Tourism Image Scraper & Media Library Ingestion API
// Protected with verifyAdminToken(), cURL, Smart Scraper & GD Auto-WebP Conversion
// ==============================================================================

require_once __DIR__ . '/config.php';

// 1. Verify Admin Security Token
verifyAdminToken();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed. Gunakan POST."]);
    exit();
}

// 2. Read and parse request payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!$data && !empty($_POST)) {
    $data = $_POST;
}

$targetUrl = isset($data['url']) ? trim($data['url']) : '';
$category = isset($data['category']) && !empty($data['category']) ? trim($data['category']) : 'island';
$destinationId = isset($data['destination_id']) ? (int)$data['destination_id'] : 0;

if (empty($targetUrl)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "URL website pariwisata wajib diisi."]);
    exit();
}

// Ensure URL has http/https scheme
if (!preg_match('/^https?:\/\//i', $targetUrl)) {
    $targetUrl = 'https://' . $targetUrl;
}

if (!filter_var($targetUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Format URL tidak valid."]);
    exit();
}

// 3. Helper function to fetch web content via cURL
function fetchUrlContent($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control: no-cache',
    ]);

    $html = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($html === false || $httpCode >= 400) {
        return ['error' => "Gagal mengakses link website (HTTP Code: $httpCode, $curlErr)"];
    }

    return ['html' => $html];
}

// 4. Fetch HTML content from target URL
$fetchRes = fetchUrlContent($targetUrl);
if (isset($fetchRes['error'])) {
    http_response_code(502);
    echo json_encode(["status" => "error", "message" => $fetchRes['error']]);
    exit();
}

$html = $fetchRes['html'];

// Helper to ensure clean UTF-8 string without broken multi-byte sequences
function cleanUtf8String($str) {
    if (empty($str)) return '';
    $str = str_replace(["’", "‘", "´", "`"], "'", $str);
    $str = str_replace(["“", "”"], '"', $str);
    // Remove non-printable characters or replacement symbols
    $str = preg_replace('/[^\PC\s]/u', '', $str);
    $str = preg_replace('/[\x00-\x1F\x7F\x{FFFD}]/u', '', $str);
    return trim(mb_convert_encoding($str, 'UTF-8', 'UTF-8'));
}

// 5. Extract Page Title
$pageTitle = '';
if (preg_match('/<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']/i', $html, $m)) {
    $pageTitle = cleanUtf8String(html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8'));
} elseif (preg_match('/<meta\s+name=["\']twitter:title["\']\s+content=["\']([^"\']+)["\']/i', $html, $m)) {
    $pageTitle = cleanUtf8String(html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8'));
} elseif (preg_match('/<title[^>]*>([^<]+)<\/title>/i', $html, $m)) {
    $pageTitle = cleanUtf8String(html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8'));
} elseif (preg_match('/<h1[^>]*>([^<]+)<\/h1>/i', $html, $m)) {
    $pageTitle = cleanUtf8String(html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8'));
}

// Clean title: remove brand suffixes like " - Wakatobi Tourism", " | Wakatobi Tourism"
if (!empty($pageTitle)) {
    $pageTitle = preg_replace('/\s*[-–—|]\s*(Wakatobi\s*Tourism|Wisata\s*Wakatobi|Official\s*Tourism|Portal\s*Pariwisata).*$/i', '', $pageTitle);
    $pageTitle = trim($pageTitle);
}

// 6. Extract Candidate Image URLs
$candidateImages = [];

// Helper to resolve relative URL to absolute URL
$parsedTarget = parse_url($targetUrl);
$baseUrlScheme = $parsedTarget['scheme'] ?? 'https';
$baseUrlHost = $parsedTarget['host'] ?? '';
$baseUrlRoot = $baseUrlScheme . '://' . $baseUrlHost;

function makeAbsoluteUrl($relUrl, $baseUrlRoot, $targetUrl) {
    $relUrl = trim($relUrl);
    if (empty($relUrl)) return '';
    if (preg_match('/^https?:\/\//i', $relUrl)) return $relUrl;
    if (strpos($relUrl, '//') === 0) return 'https:' . $relUrl;
    if (strpos($relUrl, '/') === 0) return $baseUrlRoot . $relUrl;
    
    // Relative to directory
    $dir = dirname(parse_url($targetUrl, PHP_URL_PATH) ?? '/');
    $dir = rtrim($dir, '/');
    return $baseUrlRoot . ($dir ? $dir . '/' : '/') . $relUrl;
}

// 6a. Search for OpenGraph & Twitter meta tags
if (preg_match_all('/<meta\s+(?:property|name)=["\'](?:og:image|og:image:secure_url|twitter:image|twitter:image:src)["\']\s+content=["\']([^"\']+)["\']/i', $html, $matches)) {
    foreach ($matches[1] as $imgUrl) {
        $candidateImages[] = makeAbsoluteUrl($imgUrl, $baseUrlRoot, $targetUrl);
    }
}
if (preg_match_all('/<meta\s+content=["\']([^"\']+)["\']\s+(?:property|name)=["\'](?:og:image|og:image:secure_url|twitter:image|twitter:image:src)["\'](?:[^>]*)>/i', $html, $matches)) {
    foreach ($matches[1] as $imgUrl) {
        $candidateImages[] = makeAbsoluteUrl($imgUrl, $baseUrlRoot, $targetUrl);
    }
}

// 6b. Search for direct image URLs inside wp-content/uploads/ or body HTML
if (preg_match_all('/https?:\/\/[^\s"\'<>]+\/wp-content\/uploads\/[^\s"\'<>]+\.(?:jpe?g|png|webp)/i', $html, $matches)) {
    foreach ($matches[0] as $imgUrl) {
        $candidateImages[] = $imgUrl;
    }
}

// 6c. Search all standard <img> tags
if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
    foreach ($matches[1] as $imgUrl) {
        $candidateImages[] = makeAbsoluteUrl($imgUrl, $baseUrlRoot, $targetUrl);
    }
}

// 6d. Process and filter candidate URLs
$finalCandidates = [];
$skipKeywords = [
    'logo', 'icon', 'badge', 'favicon', 'avatar', 'gravatar', 
    'play.google', 'apple.com', 'app-store', 'pattern', 'banner-ad', 
    '50x50', '100x100', '150x150', 'wp-includes', 'pixel', 'tracking',
    'emoji', 'widget', 'footer'
];

foreach ($candidateImages as $url) {
    if (empty($url)) continue;

    $urlLower = strtolower($url);
    $shouldSkip = false;
    foreach ($skipKeywords as $badWord) {
        if (strpos($urlLower, $badWord) !== false) {
            $shouldSkip = true;
            break;
        }
    }
    if ($shouldSkip) continue;

    // Check extension
    $pathExt = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
    if (!in_array($pathExt, ['jpg', 'jpeg', 'png', 'webp'])) {
        continue;
    }

    // If this is a resized WordPress thumbnail (e.g. name-768x368.jpg),
    // automatically generate and prioritize the unscaled master URL (name.jpg)!
    $unscaledUrl = preg_replace('/-\d+x\d+(\.(?:jpe?g|png|webp))$/i', '$1', $url);
    if ($unscaledUrl !== $url) {
        $finalCandidates[] = $unscaledUrl;
    }
    $finalCandidates[] = $url;
}

$finalCandidates = array_values(array_unique($finalCandidates));

if (empty($finalCandidates)) {
    http_response_code(404);
    echo json_encode([
        "status" => "error", 
        "message" => "Tidak dapat menemukan foto destinasi yang sesuai pada halaman tersebut. Pastikan link berisi artikel destinasi."
    ]);
    exit();
}

// 7. Helper function to download an image candidate to a temp file
function downloadImageCandidate($imageUrl) {
    $tempFile = tempnam(sys_get_temp_dir(), 'kasilapa_img_');
    $fp = fopen($tempFile, 'wb');
    if (!$fp) return false;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $imageUrl);
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    $exec = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    fclose($fp);

    if (!$exec || $httpCode < 200 || $httpCode >= 400 || filesize($tempFile) < 2048) {
        @unlink($tempFile);
        return false;
    }

    return $tempFile;
}

// 8. Find the best high-res image from candidates
$chosenTempFile = null;
$chosenSourceUrl = null;
$fallbackTempFile = null;
$fallbackSourceUrl = null;

foreach ($finalCandidates as $candUrl) {
    $tmpPath = downloadImageCandidate($candUrl);
    if (!$tmpPath) continue;

    $info = @getimagesize($tmpPath);
    if ($info === false) {
        @unlink($tmpPath);
        continue;
    }

    $width = $info[0];
    $height = $info[1];

    // Priority: resolution >= 400x250 (a real scenic photo)
    if ($width >= 400 && $height >= 250) {
        $chosenTempFile = $tmpPath;
        $chosenSourceUrl = $candUrl;
        break;
    }

    // Keep fallback if >= 200px
    if (!$fallbackTempFile && $width >= 200 && $height >= 150) {
        $fallbackTempFile = $tmpPath;
        $fallbackSourceUrl = $candUrl;
    } else {
        @unlink($tmpPath);
    }
}

if (!$chosenTempFile && $fallbackTempFile) {
    $chosenTempFile = $fallbackTempFile;
    $chosenSourceUrl = $fallbackSourceUrl;
}

if (!$chosenTempFile) {
    http_response_code(404);
    echo json_encode([
        "status" => "error", 
        "message" => "Gagal mengunduh foto dari website sumber. Foto mungkin diproteksi atau beresolusi terlalu kecil."
    ]);
    exit();
}

// 9. Convert & Compress to WebP (Master 1200px + Thumbnail 400px)
$uploadDir = __DIR__ . '/../img/uploads/';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$timestamp = time();
$randomHex = bin2hex(random_bytes(6));
$webpFilename = 'upload_scraped_' . $timestamp . '_' . $randomHex . '.webp';
$webpThumbFilename = 'upload_scraped_' . $timestamp . '_' . $randomHex . '_thumb.webp';
$webpTargetPath = $uploadDir . $webpFilename;
$webpThumbTargetPath = $uploadDir . $webpThumbFilename;

$convertedMaster = compressAndConvertToWebP($chosenTempFile, $webpTargetPath, 1200, 78);
$convertedThumb = compressAndConvertToWebP($chosenTempFile, $webpThumbTargetPath, 400, 75);

$relativeUrl = '';
$thumbRelativeUrl = null;

if ($convertedMaster && file_exists($webpTargetPath)) {
    $relativeUrl = '/img/uploads/' . $webpFilename;
    if ($convertedThumb && file_exists($webpThumbTargetPath)) {
        $thumbRelativeUrl = '/img/uploads/' . $webpThumbFilename;
    }
} else {
    // Fallback if GD WebP is not enabled
    $origExt = strtolower(pathinfo(parse_url($chosenSourceUrl, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
    if (!$origExt) $origExt = 'jpg';
    $fallbackFilename = 'upload_scraped_' . $timestamp . '_' . $randomHex . '.' . $origExt;
    $fallbackTargetPath = $uploadDir . $fallbackFilename;

    if (copy($chosenTempFile, $fallbackTargetPath)) {
        $relativeUrl = '/img/uploads/' . $fallbackFilename;
        $thumbRelativeUrl = $relativeUrl;
    } else {
        @unlink($chosenTempFile);
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan foto hasil scraping ke folder server."]);
        exit();
    }
}

// Clean up temp file
@unlink($chosenTempFile);

// 10. Save record to MySQL images table
$pdo = getDbConnection();
$cleanFilename = basename(parse_url($chosenSourceUrl, PHP_URL_PATH) ?? 'destination_photo.jpg');
$altText = !empty($pageTitle) ? $pageTitle : cleanUtf8String(pathinfo($cleanFilename, PATHINFO_FILENAME));

$insStmt = $pdo->prepare("
    INSERT INTO images (filename, url, thumbnail_url, alt_text_id, alt_text_en, source, category, is_active)
    VALUES (:filename, :url, :thumbnail_url, :alt_text_id, :alt_text_en, 'upload', :category, 1)
");
$insStmt->execute([
    'filename' => $cleanFilename,
    'url' => $relativeUrl,
    'thumbnail_url' => $thumbRelativeUrl,
    'alt_text_id' => $altText,
    'alt_text_en' => $altText,
    'category' => $category,
]);
$imageId = (int)$pdo->lastInsertId();

// 11. Optionally attach to destination if destination_id was provided
if ($destinationId > 0) {
    attachImageToDestination($destinationId, $imageId, 1, 0);
}

// 12. Return success JSON
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Foto destinasi berhasil ditarik dari web pariwisata dan disimpan ke Media Library!",
    "image" => [
        "id" => $imageId,
        "url" => $relativeUrl,
        "thumbnail_url" => $thumbRelativeUrl,
        "alt_text_id" => $altText,
        "alt_text_en" => $altText,
        "category" => $category,
        "is_cover" => 1,
        "sort_order" => 0
    ],
    "page_title" => $pageTitle,
    "source_url" => $targetUrl,
    "original_image_url" => $chosenSourceUrl
], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
