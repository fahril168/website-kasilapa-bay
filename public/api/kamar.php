<?php
// ==============================================================================
// Kasilapa Bay - Rooms / Accommodation CRUD API Endpoint
// PDO Prepared Statements & Token Protected for Modification Operations
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all rooms or single room by id/slug
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $_GET['id']]);
            $room = $stmt->fetch();
            if ($room) {
                echo json_encode(["status" => "success", "data" => $room]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Room not found."]);
            }
        } elseif (isset($_GET['slug'])) {
            $stmt = $pdo->prepare("SELECT * FROM rooms WHERE slug = :slug LIMIT 1");
            $stmt->execute(['slug' => $_GET['slug']]);
            $room = $stmt->fetch();
            if ($room) {
                echo json_encode(["status" => "success", "data" => $room]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Room not found."]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM rooms ORDER BY id DESC");
            $rooms = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $rooms]);
        }
        break;

    case 'POST':
        // Protected: Add new room
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['title_id']) || empty($input['slug']) || empty($input['price_per_night'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Title, slug, and price are required."]);
            exit();
        }

        $sql = "INSERT INTO rooms (title_id, title_en, slug, price_per_night, capacity, bed_type, image_url, description_id, description_en) 
                VALUES (:title_id, :title_en, :slug, :price_per_night, :capacity, :bed_type, :image_url, :description_id, :description_en)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'title_id' => $input['title_id'],
            'title_en' => $input['title_en'] ?? $input['title_id'],
            'slug' => $input['slug'],
            'price_per_night' => $input['price_per_night'],
            'capacity' => $input['capacity'] ?? 2,
            'bed_type' => $input['bed_type'] ?? 'King Bed',
            'image_url' => $input['image_url'] ?? '/img/rooms/1.webp',
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? ''
        ]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Room added successfully.", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        // Protected: Update existing room
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Room ID is required for update."]);
            exit();
        }

        $sql = "UPDATE rooms SET 
                    title_id = :title_id, 
                    title_en = :title_en, 
                    slug = :slug, 
                    price_per_night = :price_per_night, 
                    capacity = :capacity, 
                    bed_type = :bed_type, 
                    image_url = :image_url, 
                    description_id = :description_id, 
                    description_en = :description_en 
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $input['id'],
            'title_id' => $input['title_id'] ?? 'Kamar Kasilapa',
            'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Kasilapa Room'),
            'slug' => $input['slug'] ?? ('room-' . $input['id']),
            'price_per_night' => $input['price_per_night'] ?? 250000,
            'capacity' => $input['capacity'] ?? 2,
            'bed_type' => $input['bed_type'] ?? 'Double Bed',
            'image_url' => $input['image_url'] ?? '/img/rooms/1.webp',
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? ''
        ]);

        echo json_encode(["status" => "success", "message" => "Room updated successfully."]);
        break;

    case 'DELETE':
        // Protected: Delete room
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Room ID required."]);
            exit();
        }

        // Fetch old image_url to clean up physical file from disk if uploaded
        $fetchStmt = $pdo->prepare("SELECT image_url FROM rooms WHERE id = :id LIMIT 1");
        $fetchStmt->execute(['id' => $id]);
        $oldRoom = $fetchStmt->fetch();
        if ($oldRoom && !empty($oldRoom['image_url'])) {
            deleteUploadedImage($oldRoom['image_url']);
        }

        $stmt = $pdo->prepare("DELETE FROM rooms WHERE id = :id");
        $stmt->execute(['id' => $id]);

        echo json_encode(["status" => "success", "message" => "Room deleted successfully."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
