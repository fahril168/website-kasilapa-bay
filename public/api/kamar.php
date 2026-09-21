<?php
// ==============================================================================
// Kasilapa Bay - Rooms / Accommodation CRUD API Endpoint
// Centralized Media Library Enabled (many-to-many room_images)
// PDO Prepared Statements & Token Protected for Modification Operations
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// Helper: fetch all attached images for a room
function fetchRoomImagesList($pdo, $roomId) {
    $stmt = $pdo->prepare("
        SELECT 
            i.id,
            i.filename,
            i.url,
            i.thumbnail_url,
            i.alt_text_id,
            i.alt_text_en,
            i.category,
            ri.is_cover,
            ri.sort_order
        FROM room_images ri
        JOIN images i ON i.id = ri.image_id
        WHERE ri.room_id = :room_id AND i.is_active = 1
        ORDER BY ri.is_cover DESC, ri.sort_order ASC, ri.id ASC
    ");
    $stmt->execute(['room_id' => $roomId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Helper: sync image_ids array to room_images
function syncRoomImagesArray($pdo, $roomId, array $imageIds, $coverImageId = null) {
    // Delete current relations for this room
    $delStmt = $pdo->prepare("DELETE FROM room_images WHERE room_id = :room_id");
    $delStmt->execute(['room_id' => $roomId]);

    $hasCover = false;
    foreach ($imageIds as $idx => $item) {
        $imgId = is_array($item) ? (int)$item['id'] : (int)$item;
        if (!$imgId) continue;

        $isCover = false;
        if ($coverImageId !== null && (int)$coverImageId === $imgId) {
            $isCover = true;
        } elseif (is_array($item) && !empty($item['is_cover'])) {
            $isCover = true;
        } elseif ($idx === 0 && !$hasCover && $coverImageId === null) {
            $isCover = true;
        }

        if ($isCover) $hasCover = true;
        attachImageToRoom($roomId, $imgId, $isCover ? 1 : 0, $idx);
    }
}

switch ($method) {
    case 'GET':
        // Fetch all rooms or single room by id/slug
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $_GET['id']]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($room) {
                $room['images'] = fetchRoomImagesList($pdo, $room['id']);
                if (empty($room['image_url']) && !empty($room['images'])) {
                    $room['image_url'] = $room['images'][0]['url'];
                }
                echo json_encode(["status" => "success", "data" => $room]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Room not found."]);
            }
        } elseif (isset($_GET['slug'])) {
            $stmt = $pdo->prepare("SELECT * FROM rooms WHERE slug = :slug LIMIT 1");
            $stmt->execute(['slug' => $_GET['slug']]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($room) {
                $room['images'] = fetchRoomImagesList($pdo, $room['id']);
                if (empty($room['image_url']) && !empty($room['images'])) {
                    $room['image_url'] = $room['images'][0]['url'];
                }
                echo json_encode(["status" => "success", "data" => $room]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Room not found."]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM rooms ORDER BY id DESC");
            $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($rooms)) {
                $roomIds = array_column($rooms, 'id');
                $inPlaceholders = implode(',', array_fill(0, count($roomIds), '?'));
                $imgStmt = $pdo->prepare("
                    SELECT 
                        ri.room_id,
                        i.id,
                        i.filename,
                        i.url,
                        i.thumbnail_url,
                        i.alt_text_id,
                        i.alt_text_en,
                        i.category,
                        ri.is_cover,
                        ri.sort_order
                    FROM room_images ri
                    JOIN images i ON i.id = ri.image_id
                    WHERE ri.room_id IN ($inPlaceholders) AND i.is_active = 1
                    ORDER BY ri.is_cover DESC, ri.sort_order ASC, ri.id ASC
                ");
                $imgStmt->execute($roomIds);
                $allImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

                $imagesByRoom = [];
                foreach ($allImages as $img) {
                    $imagesByRoom[$img['room_id']][] = $img;
                }

                foreach ($rooms as &$r) {
                    $r['images'] = $imagesByRoom[$r['id']] ?? [];
                    if (empty($r['image_url']) && !empty($r['images'])) {
                        $r['image_url'] = $r['images'][0]['url'];
                    }
                }
                unset($r);
            }

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

        $coverUrl = $input['image_url'] ?? '/img/room.webp';

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
            'image_url' => $coverUrl,
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? ''
        ]);

        $newRoomId = (int)$pdo->lastInsertId();

        // Handle multi-image attachment
        if (!empty($input['image_ids']) && is_array($input['image_ids'])) {
            $coverId = isset($input['cover_image_id']) ? (int)$input['cover_image_id'] : null;
            syncRoomImagesArray($pdo, $newRoomId, $input['image_ids'], $coverId);
        } elseif (!empty($coverUrl)) {
            // Legacy single image_url fallback: find or register in images table
            $fStmt = $pdo->prepare("SELECT id FROM images WHERE url = :url LIMIT 1");
            $fStmt->execute(['url' => $coverUrl]);
            $existingImg = $fStmt->fetch();
            if ($existingImg) {
                attachImageToRoom($newRoomId, (int)$existingImg['id'], 1, 0);
            } else {
                $insImg = $pdo->prepare("INSERT INTO images (filename, url, source, category, is_active) VALUES (:fn, :url, 'upload', 'property', 1)");
                $insImg->execute(['fn' => basename($coverUrl), 'url' => $coverUrl]);
                attachImageToRoom($newRoomId, (int)$pdo->lastInsertId(), 1, 0);
            }
        }

        http_response_code(201);
        echo json_encode([
            "status" => "success", 
            "message" => "Room added successfully.", 
            "id" => $newRoomId
        ]);
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

        $roomId = (int)$input['id'];

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
            'id' => $roomId,
            'title_id' => $input['title_id'] ?? 'Kamar Kasilapa',
            'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Kasilapa Room'),
            'slug' => $input['slug'] ?? ('room-' . $roomId),
            'price_per_night' => $input['price_per_night'] ?? 250000,
            'capacity' => $input['capacity'] ?? 2,
            'bed_type' => $input['bed_type'] ?? 'Double Bed',
            'image_url' => $input['image_url'] ?? '/img/room.webp',
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? ''
        ]);

        // Synchronize multi-images if array is provided
        if (isset($input['image_ids']) && is_array($input['image_ids'])) {
            $coverId = isset($input['cover_image_id']) ? (int)$input['cover_image_id'] : null;
            syncRoomImagesArray($pdo, $roomId, $input['image_ids'], $coverId);
        } elseif (!empty($input['image_url'])) {
            // Legacy single image fallback
            $coverUrl = $input['image_url'];
            $fStmt = $pdo->prepare("SELECT id FROM images WHERE url = :url LIMIT 1");
            $fStmt->execute(['url' => $coverUrl]);
            $existingImg = $fStmt->fetch();
            if ($existingImg) {
                attachImageToRoom($roomId, (int)$existingImg['id'], 1, 0);
            }
        }

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

        $roomId = (int)$id;

        // Fetch all image IDs linked to this room before deleting
        $fetchStmt = $pdo->prepare("SELECT image_id FROM room_images WHERE room_id = :room_id");
        $fetchStmt->execute(['room_id' => $roomId]);
        $linkedImageIds = $fetchStmt->fetchAll(PDO::FETCH_COLUMN);

        // Delete relations and room
        $pdo->prepare("DELETE FROM room_images WHERE room_id = :room_id")->execute(['room_id' => $roomId]);
        $pdo->prepare("DELETE FROM rooms WHERE id = :id")->execute(['id' => $roomId]);

        // Clean up unreferenced images safely (checks other relations)
        foreach ($linkedImageIds as $imgId) {
            deleteUploadedImage($imgId);
        }

        echo json_encode(["status" => "success", "message" => "Room deleted successfully."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
