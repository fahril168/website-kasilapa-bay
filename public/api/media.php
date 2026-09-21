<?php
// ==============================================================================
// Kasilapa Bay - Central Media Library API Endpoint
// Manages media browsing, search, pagination, and many-to-many attachments
// Protected with verifyAdminToken()
// ==============================================================================

require_once __DIR__ . '/config.php';

// Verify Admin Security Token
verifyAdminToken();

$pdo = getDbConnection();
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

switch ($method) {
    case 'GET':
        // List media with category filter, search, and pagination
        $category = isset($_GET['category']) ? trim($_GET['category']) : '';
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $showAll = !isset($_GET['active_only']) || $_GET['active_only'] !== '1';
        $page = max(1, isset($_GET['page']) ? (int)$_GET['page'] : 1);
        $limit = max(1, min(200, isset($_GET['limit']) ? (int)$_GET['limit'] : 50));
        $offset = ($page - 1) * $limit;

        $whereClauses = [];
        $params = [];

        if (!$showAll) {
            $whereClauses[] = "is_active = 1";
        }

        if (!empty($category) && $category !== 'all') {
            $whereClauses[] = "category = :category";
            $params['category'] = $category;
        }

        if (!empty($search)) {
            $whereClauses[] = "(alt_text_id LIKE :search OR alt_text_en LIKE :search OR filename LIKE :search OR url LIKE :search)";
            $params['search'] = '%' . $search . '%';
        }

        $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

        // Count total items
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM images $whereSql");
        $countStmt->execute($params);
        $totalItems = (int)$countStmt->fetchColumn();
        $totalPages = ceil($totalItems / $limit);

        // Fetch paginated rows with usage count (how many rooms/destinations use each image)
        $sql = "
            SELECT 
                i.*,
                (SELECT COUNT(*) FROM room_images ri WHERE ri.image_id = i.id) as room_usage_count,
                (SELECT COUNT(*) FROM destination_images di WHERE di.image_id = i.id) as dest_usage_count
            FROM images i
            $whereSql
            ORDER BY i.id DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rawRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = array_map(function ($row) {
            $fallbackTitle = !empty($row['filename']) 
                ? pathinfo($row['filename'], PATHINFO_FILENAME) 
                : (!empty($row['alt_text_id']) ? $row['alt_text_id'] : 'Foto Kasilapa');
            
            $titleId = !empty($row['alt_text_id']) ? $row['alt_text_id'] : $fallbackTitle;
            $titleEn = !empty($row['alt_text_en']) ? $row['alt_text_en'] : $titleId;
            $thumb = !empty($row['thumbnail_url']) ? $row['thumbnail_url'] : $row['url'];
            $totalUsage = ((int)$row['room_usage_count']) + ((int)$row['dest_usage_count']);

            return [
                'id' => (int)$row['id'],
                'filename' => $row['filename'],
                'url' => $row['url'],
                'image_url' => $row['url'],
                'thumbnail_url' => $thumb,
                'thumb_url' => $thumb,
                'alt_text_id' => $titleId,
                'alt_text_en' => $titleEn,
                'category' => !empty($row['category']) ? $row['category'] : 'property',
                'source' => $row['source'],
                'is_active' => (int)$row['is_active'],
                'usage_count' => $totalUsage,
                'uploaded_at' => $row['uploaded_at']
            ];
        }, $rawRows);

        echo json_encode([
            "status" => "success",
            "data" => $data,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total_items" => $totalItems,
                "total_pages" => $totalPages
            ]
        ]);
        break;

    case 'POST':
        // Handle Attach action or bulk attach
        $input = json_decode(file_get_contents('php://input'), true);
        $action = isset($_GET['action']) ? $_GET['action'] : ($input['action'] ?? 'attach');

        if ($action === 'detach') {
            $targetType = $input['target_type'] ?? '';
            $targetId = isset($input['target_id']) ? (int)$input['target_id'] : 0;
            $imageId = isset($input['image_id']) ? (int)$input['image_id'] : 0;

            if (!$targetType || !$targetId || !$imageId) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "target_type, target_id, dan image_id wajib diisi."]);
                exit();
            }

            if ($targetType === 'room') {
                $pdo->prepare("DELETE FROM room_images WHERE room_id = :tid AND image_id = :iid")->execute([
                    'tid' => $targetId,
                    'iid' => $imageId
                ]);
            } elseif ($targetType === 'destination') {
                $pdo->prepare("DELETE FROM destination_images WHERE destination_id = :tid AND image_id = :iid")->execute([
                    'tid' => $targetId,
                    'iid' => $imageId
                ]);
            }

            echo json_encode(["status" => "success", "message" => "Relasi foto berhasil dilepas."]);
            break;
        }

        // Default Action: 'attach'
        $targetType = $input['target_type'] ?? '';
        $targetId = isset($input['target_id']) ? (int)$input['target_id'] : 0;
        $isCover = !empty($input['is_cover']) ? 1 : 0;
        $sortOrder = isset($input['sort_order']) ? (int)$input['sort_order'] : 0;

        if (!$targetType || !$targetId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "target_type ('room' atau 'destination') dan target_id wajib diisi."]);
            exit();
        }

        // Support single image_id or array image_ids
        $imageIds = [];
        if (!empty($input['image_ids']) && is_array($input['image_ids'])) {
            $imageIds = array_map('intval', $input['image_ids']);
        } elseif (!empty($input['image_id'])) {
            $imageIds = [(int)$input['image_id']];
        }

        if (empty($imageIds)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "image_id atau image_ids wajib disertakan."]);
            exit();
        }

        $attachedItems = [];
        foreach ($imageIds as $idx => $imgId) {
            $currentCover = ($idx === 0 && $isCover) ? 1 : 0;
            $currentOrder = $sortOrder + $idx;

            if ($targetType === 'room') {
                attachImageToRoom($targetId, $imgId, $currentCover, $currentOrder);
            } elseif ($targetType === 'destination') {
                attachImageToDestination($targetId, $imgId, $currentCover, $currentOrder);
            }

            // Fetch image row to return rich data immediately to frontend
            $imgStmt = $pdo->prepare("SELECT * FROM images WHERE id = :id LIMIT 1");
            $imgStmt->execute(['id' => $imgId]);
            $imgRow = $imgStmt->fetch(PDO::FETCH_ASSOC);

            if ($imgRow) {
                $attachedItems[] = [
                    'id' => (int)$imgRow['id'],
                    'image_id' => (int)$imgRow['id'],
                    'filename' => $imgRow['filename'],
                    'url' => $imgRow['url'],
                    'thumbnail_url' => !empty($imgRow['thumbnail_url']) ? $imgRow['thumbnail_url'] : $imgRow['url'],
                    'alt_text_id' => $imgRow['alt_text_id'],
                    'alt_text_en' => $imgRow['alt_text_en'],
                    'category' => $imgRow['category'],
                    'is_cover' => $currentCover,
                    'sort_order' => $currentOrder
                ];
            }
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => count($attachedItems) > 1 
                ? count($attachedItems) . " gambar berhasil dihubungkan!" 
                : "Gambar berhasil dihubungkan!",
            "data" => count($attachedItems) === 1 ? $attachedItems[0] : $attachedItems,
            "items" => $attachedItems
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
