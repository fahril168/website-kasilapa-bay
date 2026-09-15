<?php
// ==============================================================================
// Kasilapa Bay - Admin Authentication API Endpoint (BCRYPT Protected)
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Username and password are required."]);
        exit();
    }

    // Secure query with PDO Prepared Statement (Anti SQL-Injection)
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $admin = $stmt->fetch();

    // Verify Password using BCRYPT hash
    if ($admin && password_verify($password, $admin['password_hash'])) {
        // Generate secure random security token
        $token = bin2hex(random_bytes(32));
        
        // Save session_token to database for true token validation
        $updateStmt = $pdo->prepare("UPDATE admin_users SET session_token = :token WHERE id = :id");
        $updateStmt->execute(['token' => $token, 'id' => $admin['id']]);

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "id" => $admin['id'],
                "username" => $admin['username'],
                "email" => $admin['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
