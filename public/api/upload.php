<?php
// ==============================================================================
// Kasilapa Bay - Secure Image Upload API Endpoint with Auto-Compress to WebP
// Protected with verifyAdminToken(), MIME Validation & GD Auto-WebP Conversion
// ==============================================================================

require_once __DIR__ . '/config.php';

// Verify Admin Security Token
verifyAdminToken();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
    exit();
}

// Check if file is uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['image']['error'] ?? 'NO_FILE';
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tidak ada file foto yang dipilih atau terjadi kesalahan upload (Code: $errCode)."]);
    exit();
}

$file = $_FILES['image'];
$tmpPath = $file['tmp_name'];
$origName = basename($file['name']);
$fileSize = $file['size'];

// Max file size limit: 15 MB before compression
if ($fileSize > 15 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ukuran file terlalu besar! Maksimal 15 MB."]);
    exit();
}

// Validate file extension
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'jfif', 'bmp', 'heic', 'heif', 'tiff', 'tif', 'svg'];

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Format file tidak didukung! Pilih foto format JPG, PNG, atau WEBP."]);
    exit();
}

// Validate real image MIME type to prevent malicious script uploads
$imageInfo = @getimagesize($tmpPath);
$mimeType = function_exists('mime_content_type') ? @mime_content_type($tmpPath) : '';
$isSvg = ($ext === 'svg' && strpos(file_get_contents($tmpPath), '<svg') !== false);

if ($imageInfo === false && !$isSvg && strpos($mimeType, 'image/') !== 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "File yang diunggah bukan gambar asli yang valid."]);
    exit();
}

// Target folder for uploaded images
$uploadDir = __DIR__ . '/../img/uploads/';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// Helper function to auto-compress image to WebP using GD library
if (!function_exists('compressAndConvertToWebP')) {
function compressAndConvertToWebP($sourcePath, $destinationPath, $maxWidth = 1200, $quality = 78) {
    if (!function_exists('imagewebp')) {
        return false;
    }

    $imageInfo = @getimagesize($sourcePath);
    if (!$imageInfo) return false;

    $mime = $imageInfo['mime'];
    $img = null;

    switch ($mime) {
        case 'image/jpeg':
        case 'image/pjpeg':
            if (function_exists('imagecreatefromjpeg')) $img = @imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            if (function_exists('imagecreatefrompng')) {
                $img = @imagecreatefrompng($sourcePath);
                if ($img) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                }
            }
            break;
        case 'image/webp':
            if (function_exists('imagecreatefromwebp')) $img = @imagecreatefromwebp($sourcePath);
            break;
        case 'image/gif':
            if (function_exists('imagecreatefromgif')) $img = @imagecreatefromgif($sourcePath);
            break;
        case 'image/bmp':
        case 'image/x-ms-bmp':
            if (function_exists('imagecreatefrombmp')) $img = @imagecreatefrombmp($sourcePath);
            break;
    }

    if (!$img) return false;

    // Resize image if width exceeds maxWidth
    $origWidth = imagesx($img);
    $origHeight = imagesy($img);

    if ($origWidth > $maxWidth) {
        $newWidth = $maxWidth;
        $newHeight = (int)($origHeight * ($maxWidth / $origWidth));
        $resizedImg = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve alpha transparency for PNG/WEBP
        imagealphablending($resizedImg, false);
        imagesavealpha($resizedImg, true);
        
        imagecopyresampled($resizedImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
        imagedestroy($img);
        $img = $resizedImg;
    }

    // Save as WebP
    $success = @imagewebp($img, $destinationPath, $quality);
    imagedestroy($img);

    return $success;
}
}

// Generate secure unique filename
$timestamp = time();
$randomHex = bin2hex(random_bytes(6));
$webpFilename = 'upload_' . $timestamp . '_' . $randomHex . '.webp';
$webpThumbFilename = 'upload_' . $timestamp . '_' . $randomHex . '_thumb.webp';
$webpTargetPath = $uploadDir . $webpFilename;
$webpThumbTargetPath = $uploadDir . $webpThumbFilename;

// 1. Generate master image (1200px max width, WebP quality 78)
$convertedMaster = compressAndConvertToWebP($tmpPath, $webpTargetPath, 1200, 78);

// 2. Generate thumbnail image (400px max width, WebP quality 75)
$convertedThumb = compressAndConvertToWebP($tmpPath, $webpThumbTargetPath, 400, 75);

$relativeUrl = '';
$thumbRelativeUrl = null;

if ($convertedMaster && file_exists($webpTargetPath)) {
    $relativeUrl = '/img/uploads/' . $webpFilename;
    if ($convertedThumb && file_exists($webpThumbTargetPath)) {
        $thumbRelativeUrl = '/img/uploads/' . $webpThumbFilename;
    }
} else {
    // Fallback: If GD is not enabled on server, save original file
    $fallbackFilename = 'upload_' . $timestamp . '_' . $randomHex . '.' . $ext;
    $fallbackTargetPath = $uploadDir . $fallbackFilename;

    if (move_uploaded_file($tmpPath, $fallbackTargetPath)) {
        $relativeUrl = '/img/uploads/' . $fallbackFilename;
        $thumbRelativeUrl = $relativeUrl;
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan file foto ke folder server."]);
        exit();
    }
}

// 3. Insert record into central 'images' table
$pdo = getDbConnection();
$category = !empty($_POST['category']) ? trim($_POST['category']) : 'property';
$altTextId = !empty($_POST['alt_text_id']) ? trim($_POST['alt_text_id']) : pathinfo($origName, PATHINFO_FILENAME);
$altTextEn = !empty($_POST['alt_text_en']) ? trim($_POST['alt_text_en']) : $altTextId;

$insStmt = $pdo->prepare("
    INSERT INTO images (filename, url, thumbnail_url, alt_text_id, alt_text_en, source, category, is_active)
    VALUES (:filename, :url, :thumbnail_url, :alt_text_id, :alt_text_en, 'upload', :category, 1)
");
$insStmt->execute([
    'filename' => $origName,
    'url' => $relativeUrl,
    'thumbnail_url' => $thumbRelativeUrl,
    'alt_text_id' => $altTextId,
    'alt_text_en' => $altTextEn,
    'category' => $category,
]);
$imageId = (int)$pdo->lastInsertId();

// 4. Optionally attach to room or destination if IDs provided in POST
if (!empty($_POST['room_id'])) {
    $roomId = (int)$_POST['room_id'];
    $isCover = !empty($_POST['is_cover']) ? 1 : 0;
    $sortOrder = isset($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0;
    attachImageToRoom($roomId, $imageId, $isCover, $sortOrder);
} elseif (!empty($_POST['destination_id'])) {
    $destId = (int)$_POST['destination_id'];
    $isCover = !empty($_POST['is_cover']) ? 1 : 0;
    $sortOrder = isset($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0;
    attachImageToDestination($destId, $imageId, $isCover, $sortOrder);
}

http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Foto berhasil diunggah dan disimpan ke Media Library!",
    "image_id" => $imageId,
    "image_url" => $relativeUrl,
    "thumbnail_url" => $thumbRelativeUrl,
    "category" => $category
]);

