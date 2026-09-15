<?php
// ==============================================================================
// Kasilapa Bay - Reviews API Endpoint
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM reviews ORDER BY id DESC");
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "INSERT INTO reviews (guest_name, origin, rating, comment_id, comment_en, is_visible) 
                VALUES (:guest_name, :origin, :rating, :comment_id, :comment_en, :is_visible)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'guest_name' => $input['guest_name'],
            'origin' => $input['origin'] ?? 'Indonesia',
            'rating' => $input['rating'] ?? 5,
            'comment_id' => $input['comment_id'],
            'comment_en' => $input['comment_en'] ?? $input['comment_id'],
            'is_visible' => $input['is_visible'] ?? 1
        ]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Ulasan berhasil ditambahkan.", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "UPDATE reviews SET guest_name = :guest_name, origin = :origin, rating = :rating, comment_id = :comment_id, comment_en = :comment_en, is_visible = :is_visible WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $input['id'],
            'guest_name' => $input['guest_name'],
            'origin' => $input['origin'],
            'rating' => $input['rating'],
            'comment_id' => $input['comment_id'],
            'comment_en' => $input['comment_en'],
            'is_visible' => $input['is_visible']
        ]);

        echo json_encode(["status" => "success", "message" => "Ulasan berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Ulasan berhasil dihapus."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
