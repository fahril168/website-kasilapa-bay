<?php
// ==============================================================================
// Kasilapa Bay - Destinations API Endpoint
// Centralized Media Library Enabled (many-to-many destination_images)
// PDO Prepared Statements & Token Protected for Modification Operations
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// Helper: fetch all attached images for a destination
function fetchDestinationImagesList($pdo, $destId) {
    $stmt = $pdo->prepare("
        SELECT 
            i.id,
            i.filename,
            i.url,
            i.thumbnail_url,
            i.alt_text_id,
            i.alt_text_en,
            i.category,
            di.is_cover,
            di.sort_order
        FROM destination_images di
        JOIN images i ON i.id = di.image_id
        WHERE di.destination_id = :dest_id AND i.is_active = 1
        ORDER BY di.is_cover DESC, di.sort_order ASC, di.id ASC
    ");
    $stmt->execute(['dest_id' => $destId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Helper: sync image_ids array to destination_images
function syncDestinationImagesArray($pdo, $destId, array $imageIds, $coverImageId = null) {
    // Delete current relations for this destination
    $delStmt = $pdo->prepare("DELETE FROM destination_images WHERE destination_id = :dest_id");
    $delStmt->execute(['dest_id' => $destId]);

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
        attachImageToDestination($destId, $imgId, $isCover ? 1 : 0, $idx);
    }
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM destinations WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $_GET['id']]);
            $dest = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($dest) {
                $dest['images'] = fetchDestinationImagesList($pdo, $dest['id']);
                if (empty($dest['image_url']) && !empty($dest['images'])) {
                    $dest['image_url'] = $dest['images'][0]['url'];
                }
                echo json_encode(["status" => "success", "data" => $dest]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Destinasi tidak ditemukan."]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM destinations ORDER BY id DESC");
            $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($destinations)) {
                $destIds = array_column($destinations, 'id');
                $inPlaceholders = implode(',', array_fill(0, count($destIds), '?'));
                $imgStmt = $pdo->prepare("
                    SELECT 
                        di.destination_id,
                        i.id,
                        i.filename,
                        i.url,
                        i.thumbnail_url,
                        i.alt_text_id,
                        i.alt_text_en,
                        i.category,
                        di.is_cover,
                        di.sort_order
                    FROM destination_images di
                    JOIN images i ON i.id = di.image_id
                    WHERE di.destination_id IN ($inPlaceholders) AND i.is_active = 1
                    ORDER BY di.is_cover DESC, di.sort_order ASC, di.id ASC
                ");
                $imgStmt->execute($destIds);
                $allImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

                $imagesByDest = [];
                foreach ($allImages as $img) {
                    $imagesByDest[$img['destination_id']][] = $img;
                }

                foreach ($destinations as &$d) {
                    $d['images'] = $imagesByDest[$d['id']] ?? [];
                    if (empty($d['image_url']) && !empty($d['images'])) {
                        $d['image_url'] = $d['images'][0]['url'];
                    }
                }
                unset($d);
            }

            echo json_encode(["status" => "success", "data" => $destinations]);
        }
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['name_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nama destinasi wajib diisi."]);
            exit();
        }

        $coverUrl = $input['image_url'] ?? '/img/hero.webp';

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
            'image_url' => $coverUrl,
            'info_url' => $input['info_url'] ?? ''
        ]);

        $newDestId = (int)$pdo->lastInsertId();

        // Handle multi-image attachment
        if (!empty($input['image_ids']) && is_array($input['image_ids'])) {
            $coverId = isset($input['cover_image_id']) ? (int)$input['cover_image_id'] : null;
            syncDestinationImagesArray($pdo, $newDestId, $input['image_ids'], $coverId);
        } elseif (!empty($coverUrl)) {
            // Legacy single image fallback
            $fStmt = $pdo->prepare("SELECT id FROM images WHERE url = :url LIMIT 1");
            $fStmt->execute(['url' => $coverUrl]);
            $existingImg = $fStmt->fetch();
            if ($existingImg) {
                attachImageToDestination($newDestId, (int)$existingImg['id'], 1, 0);
            } else {
                $insImg = $pdo->prepare("INSERT INTO images (filename, url, source, category, is_active) VALUES (:fn, :url, 'upload', 'island', 1)");
                $insImg->execute(['fn' => basename($coverUrl), 'url' => $coverUrl]);
                attachImageToDestination($newDestId, (int)$pdo->lastInsertId(), 1, 0);
            }
        }

        http_response_code(201);
        echo json_encode([
            "status" => "success", 
            "message" => "Destinasi berhasil ditambahkan.", 
            "id" => $newDestId
        ]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID destinasi wajib diisi untuk update."]);
            exit();
        }

        $destId = (int)$input['id'];

        $sql = "UPDATE destinations SET 
                    name_id = :name_id, name_en = :name_en, category = :category, 
                    description_id = :description_id, description_en = :description_en, 
                    distance = :distance, image_url = :image_url, info_url = :info_url 
                WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $destId,
            'name_id' => $input['name_id'],
            'name_en' => $input['name_en'] ?? $input['name_id'],
            'category' => $input['category'] ?? 'Alam',
            'description_id' => $input['description_id'] ?? '',
            'description_en' => $input['description_en'] ?? '',
            'distance' => $input['distance'] ?? '10 menit',
            'image_url' => $input['image_url'] ?? '',
            'info_url' => $input['info_url'] ?? ''
        ]);

        // Synchronize multi-images if array is provided
        if (isset($input['image_ids']) && is_array($input['image_ids'])) {
            $coverId = isset($input['cover_image_id']) ? (int)$input['cover_image_id'] : null;
            syncDestinationImagesArray($pdo, $destId, $input['image_ids'], $coverId);
        } elseif (!empty($input['image_url'])) {
            $coverUrl = $input['image_url'];
            $fStmt = $pdo->prepare("SELECT id FROM images WHERE url = :url LIMIT 1");
            $fStmt->execute(['url' => $coverUrl]);
            $existingImg = $fStmt->fetch();
            if ($existingImg) {
                attachImageToDestination($destId, (int)$existingImg['id'], 1, 0);
            }
        }

        echo json_encode(["status" => "success", "message" => "Destinasi berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID destinasi wajib diisi."]);
            exit();
        }

        $destId = (int)$id;

        // Fetch all image IDs linked to this destination before deleting
        $fetchStmt = $pdo->prepare("SELECT image_id FROM destination_images WHERE destination_id = :dest_id");
        $fetchStmt->execute(['dest_id' => $destId]);
        $linkedImageIds = $fetchStmt->fetchAll(PDO::FETCH_COLUMN);

        // Delete relations and destination
        $pdo->prepare("DELETE FROM destination_images WHERE destination_id = :dest_id")->execute(['dest_id' => $destId]);
        $pdo->prepare("DELETE FROM destinations WHERE id = :id")->execute(['id' => $destId]);

        // Clean up unreferenced images safely
        foreach ($linkedImageIds as $imgId) {
            deleteUploadedImage($imgId);
        }

        echo json_encode(["status" => "success", "message" => "Destinasi berhasil dihapus."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
