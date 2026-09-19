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
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials (Hostinger MySQL)
define('DB_HOST', 'localhost');
define('DB_USER', 'u552286068_admin');       // Username MySQL Hostinger
define('DB_PASS', 'Riel2323'); // <-- GANTI DENGAN PASSWORD DATABASE ANDA
define('DB_NAME', 'u552286068_kasilapa');    // Nama Database MySQL Hostinger

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

// Helper to safely delete physical uploaded image files from disk
function deleteUploadedImage($imageUrl) {
    if (empty($imageUrl) || !is_string($imageUrl)) return;
    if (strpos($imageUrl, '/img/uploads/') === 0) {
        $realPath = __DIR__ . '/..' . $imageUrl;
        if (file_exists($realPath) && is_file($realPath)) {
            @unlink($realPath);
        }
    }
}
