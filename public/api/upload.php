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

// Generate secure unique filename
$timestamp = time();
$randomHex = bin2hex(random_bytes(6));
$webpFilename = 'upload_' . $timestamp . '_' . $randomHex . '.webp';
$webpTargetPath = $uploadDir . $webpFilename;

// Attempt auto-compression to WebP
$converted = compressAndConvertToWebP($tmpPath, $webpTargetPath, 1200, 78);

if ($converted && file_exists($webpTargetPath)) {
    $relativeUrl = '/img/uploads/' . $webpFilename;
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Foto berhasil diunggah dan di-compress otomatis ke WebP!",
        "image_url" => $relativeUrl
    ]);
    exit();
}

// Fallback: If GD is not enabled on local CLI, save original file
$fallbackFilename = 'upload_' . $timestamp . '_' . $randomHex . '.' . $ext;
$fallbackTargetPath = $uploadDir . $fallbackFilename;

if (move_uploaded_file($tmpPath, $fallbackTargetPath)) {
    $relativeUrl = '/img/uploads/' . $fallbackFilename;
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Foto berhasil diunggah!",
        "image_url" => $relativeUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan file foto ke folder server."]);
}
