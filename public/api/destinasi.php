<?php
// ==============================================================================
// Kasilapa Bay - Destinations API Endpoint
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM destinations WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $_GET['id']]);
            echo json_encode(["status" => "success", "data" => $stmt->fetch()]);
        } else {
            $stmt = $pdo->query("SELECT * FROM destinations ORDER BY id DESC");
            echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
        }
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "INSERT INTO destinations (name_id, name_en, category, description_id, description_en, distance, image_url, info_url) 
                VALUES (:name_id, :name_en, :category, :description_id, :description_en, :distance, :image_url, :info_url)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'name_id' => $input['name_id'],
            'name_en' => $input['name_en'] ?? $input['name_id'],
            'category' => $input['category'] ?? 'Alam',
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? '',
            'distance' => $input['distance'] ?? '10 menit',
            'image_url' => $input['image_url'] ?? '/img/rooms/1.webp',
            'info_url' => $input['info_url'] ?? ''
        ]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Destinasi berhasil ditambahkan.", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "UPDATE destinations SET 
                    name_id = :name_id, name_en = :name_en, category = :category, 
                    description_id = :description_id, description_en = :description_en, 
                    distance = :distance, image_url = :image_url, info_url = :info_url 
                WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $input['id'],
            'name_id' => $input['name_id'],
            'name_en' => $input['name_en'],
            'category' => $input['category'],
            'description_id' => $input['description_id'],
            'description_en' => $input['description_en'],
            'distance' => $input['distance'],
            'image_url' => $input['image_url'],
            'info_url' => $input['info_url']
        ]);

        echo json_encode(["status" => "success", "message" => "Destinasi berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if ($id) {
            $fetchStmt = $pdo->prepare("SELECT image_url FROM destinations WHERE id = :id LIMIT 1");
            $fetchStmt->execute(['id' => $id]);
            $dest = $fetchStmt->fetch();
            if ($dest && !empty($dest['image_url'])) {
                deleteUploadedImage($dest['image_url']);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM destinations WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Destinasi berhasil dihapus."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
