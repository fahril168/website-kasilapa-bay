<?php
// ==============================================================================
// Kasilapa Bay - Centralized Configuration & Database Connection
// PDO Prepared Statements for MySQL Security (Prevent SQL Injection)
// ==============================================================================

// Set JSON Header & CORS for API requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials
// Optional external configuration override (recommended for production)
if (file_exists(__DIR__ . '/db_config.php')) {
    require_once __DIR__ . '/db_config.php';
}

// Auto-detect environment: Localhost (XAMPP) vs Production (Hostinger)
if (!defined('DB_HOST')) {
    $isLocalhost = (
        (isset($_SERVER['SERVER_NAME']) && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1'])) ||
        (isset($_SERVER['HTTP_HOST']) && (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false)) ||
        php_sapi_name() === 'cli' ||
        php_sapi_name() === 'cli-server'
    );

    if ($isLocalhost) {
        // Localhost XAMPP MySQL Credentials
        define('DB_HOST', 'localhost');
        define('DB_USER', 'root');
        define('DB_PASS', '');
        define('DB_NAME', 'kasilapa_db');
    } else {
        // Hostinger Production MySQL Credentials
        define('DB_HOST', 'localhost');
        define('DB_USER', 'u552286068_admin');       // Username MySQL Hostinger
        define('DB_PASS', 'Riel2323');                // Password MySQL Hostinger
        define('DB_NAME', 'u552286068_kasilapa');    // Nama Database MySQL Hostinger
    }
}

// Function to establish PDO Database Connection
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database connection failed: " . $e->getMessage()
        ]);
        exit();
    }
}

// Function to verify Admin Security Token (Cross-compatible with Apache/Nginx/PHP CLI)
function verifyAdminToken() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = '';
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Akses ditolak. Token autentikasi diperlukan."]);
        exit();
    }

    $token = trim($matches[1]);
    if (empty($token) || strlen($token) < 32) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Token sesi tidak valid atau telah kadaluarsa."]);
        exit();
    }

    // Verify token against database using PDO Prepared Statement
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE session_token = :token LIMIT 1");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Sesi tidak valid atau telah kadaluarsa. Silakan login kembali."]);
        exit();
    }

    return true;
}

// Helper to attach image to room (many-to-many junction)
function attachImageToRoom($roomId, $imageId, $isCover = 0, $sortOrder = 0) {
    if (!$roomId || !$imageId) return false;
    $pdo = getDbConnection();

    // If marked as cover, unmark existing covers for this room
    if ($isCover) {
        $pdo->prepare("UPDATE room_images SET is_cover = 0 WHERE room_id = :room_id")->execute(['room_id' => $roomId]);
        
        // Update rooms.image_url cache for backward compatibility
        $imgStmt = $pdo->prepare("SELECT url FROM images WHERE id = :id LIMIT 1");
        $imgStmt->execute(['id' => $imageId]);
        $img = $imgStmt->fetch();
        if ($img && !empty($img['url'])) {
            $pdo->prepare("UPDATE rooms SET image_url = :url WHERE id = :room_id")->execute([
                'url' => $img['url'],
                'room_id' => $roomId
            ]);
        }
    }

    // Check if relation already exists
    $checkStmt = $pdo->prepare("SELECT id FROM room_images WHERE room_id = :room_id AND image_id = :image_id LIMIT 1");
    $checkStmt->execute(['room_id' => $roomId, 'image_id' => $imageId]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare("UPDATE room_images SET is_cover = :is_cover, sort_order = :sort_order WHERE id = :id");
        $stmt->execute([
            'is_cover' => $isCover ? 1 : 0,
            'sort_order' => $sortOrder,
            'id' => $existing['id']
        ]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO room_images (room_id, image_id, is_cover, sort_order) VALUES (:room_id, :image_id, :is_cover, :sort_order)");
        $stmt->execute([
            'room_id' => $roomId,
            'image_id' => $imageId,
            'is_cover' => $isCover ? 1 : 0,
            'sort_order' => $sortOrder
        ]);
    }

    return true;
}

// Helper to attach image to destination (many-to-many junction)
function attachImageToDestination($destinationId, $imageId, $isCover = 0, $sortOrder = 0) {
    if (!$destinationId || !$imageId) return false;
    $pdo = getDbConnection();

    // If marked as cover, unmark existing covers for this destination
    if ($isCover) {
        $pdo->prepare("UPDATE destination_images SET is_cover = 0 WHERE destination_id = :dest_id")->execute(['dest_id' => $destinationId]);
        
        // Update destinations.image_url cache for backward compatibility
        $imgStmt = $pdo->prepare("SELECT url FROM images WHERE id = :id LIMIT 1");
        $imgStmt->execute(['id' => $imageId]);
        $img = $imgStmt->fetch();
        if ($img && !empty($img['url'])) {
            $pdo->prepare("UPDATE destinations SET image_url = :url WHERE id = :dest_id")->execute([
                'url' => $img['url'],
                'dest_id' => $destinationId
            ]);
        }
    }

    // Check if relation already exists
    $checkStmt = $pdo->prepare("SELECT id FROM destination_images WHERE destination_id = :dest_id AND image_id = :image_id LIMIT 1");
    $checkStmt->execute(['dest_id' => $destinationId, 'image_id' => $imageId]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare("UPDATE destination_images SET is_cover = :is_cover, sort_order = :sort_order WHERE id = :id");
        $stmt->execute([
            'is_cover' => $isCover ? 1 : 0,
            'sort_order' => $sortOrder,
            'id' => $existing['id']
        ]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO destination_images (destination_id, image_id, is_cover, sort_order) VALUES (:dest_id, :image_id, :is_cover, :sort_order)");
        $stmt->execute([
            'dest_id' => $destinationId,
            'image_id' => $imageId,
            'is_cover' => $isCover ? 1 : 0,
            'sort_order' => $sortOrder
        ]);
    }

    return true;
}

// Helper to safely delete physical uploaded image files from disk
// Crucial: checks if the image is still referenced in other rooms or destinations before unlinking physical files!
function deleteUploadedImage($imageIdentifier) {
    if (empty($imageIdentifier)) return;
    $pdo = getDbConnection();

    $imageId = null;
    $imageUrl = null;
    $thumbnailUrl = null;

    if (is_numeric($imageIdentifier)) {
        $imageId = (int)$imageIdentifier;
        $stmt = $pdo->prepare("SELECT id, url, thumbnail_url FROM images WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $imageId]);
        $row = $stmt->fetch();
        if ($row) {
            $imageUrl = $row['url'];
            $thumbnailUrl = $row['thumbnail_url'];
        }
    } elseif (is_string($imageIdentifier)) {
        $imageUrl = $imageIdentifier;
        $stmt = $pdo->prepare("SELECT id, url, thumbnail_url FROM images WHERE url = :url LIMIT 1");
        $stmt->execute(['url' => $imageUrl]);
        $row = $stmt->fetch();
        if ($row) {
            $imageId = (int)$row['id'];
            $thumbnailUrl = $row['thumbnail_url'];
        }
    }

    if (!$imageId && !$imageUrl) return;

    // Check if still referenced in room_images or destination_images
    if ($imageId) {
        $refCountRoom = $pdo->prepare("SELECT COUNT(*) FROM room_images WHERE image_id = :id");
        $refCountRoom->execute(['id' => $imageId]);
        $cRoom = (int)$refCountRoom->fetchColumn();

        $refCountDest = $pdo->prepare("SELECT COUNT(*) FROM destination_images WHERE image_id = :id");
        $refCountDest->execute(['id' => $imageId]);
        $cDest = (int)$refCountDest->fetchColumn();

        if ($cRoom > 0 || $cDest > 0) {
            // Still in use in other rooms or destinations! Do NOT delete physical file from disk.
            return;
        }

        // Also delete row from images table if no longer referenced anywhere
        $pdo->prepare("DELETE FROM images WHERE id = :id")->execute(['id' => $imageId]);
    }

    // Safely delete physical files from disk only if in /img/uploads/
    if ($imageUrl && strpos($imageUrl, '/img/uploads/') === 0) {
        $realPath = __DIR__ . '/..' . $imageUrl;
        if (file_exists($realPath) && is_file($realPath)) {
            @unlink($realPath);
        }
    }
    if ($thumbnailUrl && strpos($thumbnailUrl, '/img/uploads/') === 0) {
        $realThumbPath = __DIR__ . '/..' . $thumbnailUrl;
        if (file_exists($realThumbPath) && is_file($realThumbPath)) {
            @unlink($realThumbPath);
        }
    }
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
