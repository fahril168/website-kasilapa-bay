<?php
// ==============================================================================
// Kasilapa Bay - Gallery API Endpoint
// Powered by Centralized Media Library (images table)
// Backward-compatible for legacy frontend readers with thumbnail_url support
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

switch ($method) {
    case 'GET':
        // Determine whether to show all (admin/manage view) or active only (public view)
        $showAll = isset($_GET['all']) && ($_GET['all'] === '1' || $_GET['all'] === 'true');
        $category = isset($_GET['category']) ? trim($_GET['category']) : '';

        $whereClauses = [];
        $params = [];

        if (!$showAll) {
            $whereClauses[] = "is_active = 1";
        }

        if (!empty($category) && $category !== 'all') {
            $whereClauses[] = "category = :category";
            $params['category'] = $category;
        }

        $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";
        $sql = "SELECT * FROM images $whereSql ORDER BY id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rawRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Normalize and map fields for complete frontend compatibility
        $normalized = array_map(function ($row) {
            $fallbackTitle = !empty($row['filename']) 
                ? pathinfo($row['filename'], PATHINFO_FILENAME) 
                : (!empty($row['alt_text_id']) ? $row['alt_text_id'] : 'Foto Kasilapa');
            
            $titleId = !empty($row['alt_text_id']) ? $row['alt_text_id'] : $fallbackTitle;
            $titleEn = !empty($row['alt_text_en']) ? $row['alt_text_en'] : $titleId;
            $thumb = !empty($row['thumbnail_url']) ? $row['thumbnail_url'] : $row['url'];

            return [
                'id' => (int)$row['id'],
                'title_id' => $titleId,
                'title_en' => $titleEn,
                'category' => !empty($row['category']) ? $row['category'] : 'property',
                'url' => $row['url'],
                'image_url' => $row['url'], // Backward compatibility
                'thumbnail_url' => $thumb,
                'thumb_url' => $thumb,       // Shorthand convenience
                'is_active' => (int)$row['is_active'],
                'source' => $row['source'],
                'filename' => $row['filename'],
                'uploaded_at' => $row['uploaded_at']
            ];
        }, $rawRows);

        echo json_encode(["status" => "success", "data" => $normalized]);
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $imageUrl = $input['image_url'] ?? ($input['url'] ?? '');
        if (empty($imageUrl)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Image URL wajib diisi."]);
            exit();
        }

        $titleId = $input['title_id'] ?? ($input['alt_text_id'] ?? 'Foto Galeri');
        $titleEn = $input['title_en'] ?? ($input['alt_text_en'] ?? $titleId);
        $category = $input['category'] ?? 'property';
        $thumbUrl = $input['thumbnail_url'] ?? $imageUrl;
        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;
        $source = (strpos($imageUrl, 'http://') === 0 || strpos($imageUrl, 'https://') === 0) ? 'external' : 'upload';

        // Check if an image record with this ID or URL already exists in 'images' table (e.g. just uploaded via upload.php)
        $existingImage = null;
        if (!empty($input['id'])) {
            $chk = $pdo->prepare("SELECT id FROM images WHERE id = :id LIMIT 1");
            $chk->execute(['id' => (int)$input['id']]);
            $existingImage = $chk->fetch();
        }
        if (!$existingImage && !empty($imageUrl)) {
            $chk = $pdo->prepare("SELECT id FROM images WHERE url = :url LIMIT 1");
            $chk->execute(['url' => $imageUrl]);
            $existingImage = $chk->fetch();
        }

        if ($existingImage) {
            // Update existing image record with user-provided title, category, and active status
            $updStmt = $pdo->prepare("
                UPDATE images 
                SET alt_text_id = :alt_id, alt_text_en = :alt_en, category = :cat, is_active = :act, thumbnail_url = :thumb 
                WHERE id = :id
            ");
            $updStmt->execute([
                'alt_id' => $titleId,
                'alt_en' => $titleEn,
                'cat' => $category,
                'act' => $isActive,
                'thumb' => $thumbUrl,
                'id' => (int)$existingImage['id']
            ]);

            http_response_code(200);
            echo json_encode([
                "status" => "success", 
                "message" => "Foto galeri berhasil disimpan ke Media Library.", 
                "id" => (int)$existingImage['id']
            ]);
            break;
        }

        // Otherwise insert new record
        $sql = "INSERT INTO images (filename, url, thumbnail_url, alt_text_id, alt_text_en, source, category, is_active) 
                VALUES (:fn, :url, :thumb, :alt_id, :alt_en, :src, :cat, :act)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'fn' => basename($imageUrl),
            'url' => $imageUrl,
            'thumb' => $thumbUrl,
            'alt_id' => $titleId,
            'alt_en' => $titleEn,
            'src' => $source,
            'cat' => $category,
            'act' => $isActive
        ]);

        http_response_code(201);
        echo json_encode([
            "status" => "success", 
            "message" => "Foto galeri berhasil ditambahkan ke Media Library.", 
            "id" => (int)$pdo->lastInsertId()
        ]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Image ID wajib diisi untuk update."]);
            exit();
        }

        $id = (int)$input['id'];

        // Check if only is_active toggle is requested
        if (isset($input['is_active']) && !isset($input['category']) && !isset($input['title_id']) && !isset($input['image_url'])) {
            $stmt = $pdo->prepare("UPDATE images SET is_active = :is_active WHERE id = :id");
            $stmt->execute([
                'id' => $id,
                'is_active' => (int)$input['is_active']
            ]);
            echo json_encode(["status" => "success", "message" => "Status aktif foto berhasil diperbarui."]);
            break;
        }

        // Full update
        $updates = [];
        $params = ['id' => $id];

        if (isset($input['is_active'])) {
            $updates[] = "is_active = :is_active";
            $params['is_active'] = (int)$input['is_active'];
        }
        if (isset($input['category'])) {
            $updates[] = "category = :category";
            $params['category'] = trim($input['category']);
        }
        if (isset($input['title_id'])) {
            $updates[] = "alt_text_id = :alt_text_id";
            $params['alt_text_id'] = trim($input['title_id']);
        }
        if (isset($input['title_en'])) {
            $updates[] = "alt_text_en = :alt_text_en";
            $params['alt_text_en'] = trim($input['title_en']);
        }
        if (isset($input['image_url']) || isset($input['url'])) {
            $newUrl = $input['image_url'] ?? $input['url'];
            $updates[] = "url = :url";
            $params['url'] = $newUrl;
        }

        if (!empty($updates)) {
            $sql = "UPDATE images SET " . implode(", ", $updates) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        echo json_encode(["status" => "success", "message" => "Data foto galeri berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Image ID wajib diisi."]);
            exit();
        }

        $imageId = (int)$id;

        // Detach relations from rooms and destinations
        $pdo->prepare("DELETE FROM room_images WHERE image_id = :id")->execute(['id' => $imageId]);
        $pdo->prepare("DELETE FROM destination_images WHERE image_id = :id")->execute(['id' => $imageId]);

        // Safely delete physical file from disk if uploaded
        deleteUploadedImage($imageId);

        // Delete permanently from images table
        $pdo->prepare("DELETE FROM images WHERE id = :id")->execute(['id' => $imageId]);

        echo json_encode(["status" => "success", "message" => "Foto berhasil dihapus secara permanen dari galeri dan database."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
