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

if ($method === 'PUT') {
    // Verify Admin Session Token
    verifyAdminToken();

    $input = json_decode(file_get_contents('php://input'), true);

    $currentPassword = trim($input['current_password'] ?? '');
    $newUsername = trim($input['new_username'] ?? '');
    $newPassword = trim($input['new_password'] ?? '');

    if (empty($currentPassword)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Password saat ini wajib diisi untuk verifikasi."]);
        exit();
    }

    // Get current admin user from database (ID = 1 or active admin)
    $stmt = $pdo->query("SELECT * FROM admin_users ORDER BY id ASC LIMIT 1");
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Akun admin tidak ditemukan."]);
        exit();
    }

    // Verify current password with BCRYPT
    if (!password_verify($currentPassword, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Password saat ini tidak cocok!"]);
        exit();
    }

    $updatedUsername = $admin['username'];
    $newHash = $admin['password_hash'];

    if (!empty($newUsername)) {
        $updatedUsername = $newUsername;
    }

    if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password baru minimal 6 karakter!"]);
            exit();
        }
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    }

    $updateStmt = $pdo->prepare("UPDATE admin_users SET username = :username, password_hash = :hash WHERE id = :id");
    $updateStmt->execute([
        'username' => $updatedUsername,
        'hash' => $newHash,
        'id' => $admin['id']
    ]);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Username dan Password Admin berhasil diperbarui!",
        "new_username" => $updatedUsername
    ]);
    exit();
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
