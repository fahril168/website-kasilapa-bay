<?php
// ==============================================================================
// Kasilapa Bay - Facilities API Endpoint
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM facilities ORDER BY id ASC");
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "INSERT INTO facilities (title_id, title_en, icon_name, is_active) VALUES (:title_id, :title_en, :icon_name, :is_active)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'title_id' => $input['title_id'],
            'title_en' => $input['title_en'] ?? $input['title_id'],
            'icon_name' => $input['icon_name'] ?? 'wifi',
            'is_active' => $input['is_active'] ?? 1
        ]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Fasilitas berhasil ditambahkan.", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID fasilitas wajib disertakan."]);
            exit();
        }

        $existStmt = $pdo->prepare("SELECT * FROM facilities WHERE id = :id LIMIT 1");
        $existStmt->execute(['id' => (int)$input['id']]);
        $existing = $existStmt->fetch();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Fasilitas tidak ditemukan."]);
            exit();
        }

        $sql = "UPDATE facilities SET title_id = :title_id, title_en = :title_en, icon_name = :icon_name, is_active = :is_active WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => (int)$input['id'],
            'title_id' => $input['title_id'] ?? $existing['title_id'],
            'title_en' => $input['title_en'] ?? $existing['title_en'],
            'icon_name' => $input['icon_name'] ?? $existing['icon_name'],
            'is_active' => isset($input['is_active']) ? (int)$input['is_active'] : (int)$existing['is_active']
        ]);

        echo json_encode(["status" => "success", "message" => "Fasilitas berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        $stmt = $pdo->prepare("DELETE FROM facilities WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Fasilitas berhasil dihapus."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
