<?php
// ==============================================================================
// Kasilapa Bay - Change Admin Username & Password API Endpoint
// PDO Prepared Statements & BCRYPT Password Hashing
// ==============================================================================

require_once __DIR__ . '/config.php';

// Verify Admin Session Token
verifyAdminToken();

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
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

    // Prepare updates
    $updatedUsername = !empty($newUsername) ? $newUsername : $admin['username'];
    $updatedPasswordHash = $admin['password_hash'];

    if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password baru minimal 6 karakter."]);
            exit();
        }
        $updatedPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);
    }

    // Update admin user in database
    $updateStmt = $pdo->prepare("UPDATE admin_users SET username = :username, password_hash = :password_hash WHERE id = :id");
    $updateStmt->execute([
        'username' => $updatedUsername,
        'password_hash' => $updatedPasswordHash,
        'id' => $admin['id']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Username dan Password Admin berhasil diperbarui!",
        "new_username" => $updatedUsername
    ]);
    exit();
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
