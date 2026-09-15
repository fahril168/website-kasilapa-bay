<?php
// ==============================================================================
// Kasilapa Bay - Gallery API Endpoint
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $activeOnly = isset($_GET['active_only']) && ($_GET['active_only'] === '1' || $_GET['active_only'] === 'true');
        
        try {
            if ($activeOnly) {
                $stmt = $pdo->query("SELECT * FROM gallery WHERE is_active = 1 ORDER BY id ASC");
            } else {
                $stmt = $pdo->query("SELECT * FROM gallery ORDER BY id ASC");
            }
            $data = $stmt->fetchAll();
        } catch (PDOException $e) {
            // Fallback if is_active column doesn't exist yet in legacy db
            $stmt = $pdo->query("SELECT * FROM gallery ORDER BY id ASC");
            $data = $stmt->fetchAll();
        }

        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'POST':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['image_url'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Image URL is required."]);
            exit();
        }

        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;

        try {
            $sql = "INSERT INTO gallery (title_id, title_en, category, image_url, is_active) VALUES (:title_id, :title_en, :category, :image_url, :is_active)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'title_id' => $input['title_id'] ?? 'Foto Galeri',
                'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Gallery Photo'),
                'category' => $input['category'] ?? 'property',
                'image_url' => $input['image_url'],
                'is_active' => $isActive
            ]);
        } catch (PDOException $e) {
            // Fallback for legacy table without is_active column
            $sql = "INSERT INTO gallery (title_id, title_en, category, image_url) VALUES (:title_id, :title_en, :category, :image_url)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'title_id' => $input['title_id'] ?? 'Foto Galeri',
                'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Gallery Photo'),
                'category' => $input['category'] ?? 'property',
                'image_url' => $input['image_url']
            ]);
        }

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Foto galeri berhasil ditambahkan.", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Gallery item ID is required."]);
            exit();
        }

        // Check if only is_active is being updated (toggle)
        if (isset($input['is_active']) && !isset($input['title_id']) && !isset($input['image_url'])) {
            try {
                $stmt = $pdo->prepare("UPDATE gallery SET is_active = :is_active WHERE id = :id");
                $stmt->execute([
                    'id' => $input['id'],
                    'is_active' => (int)$input['is_active']
                ]);
            } catch (PDOException $e) {
                // Legacy schema ignore
            }
            echo json_encode(["status" => "success", "message" => "Status foto galeri berhasil diperbarui."]);
            break;
        }

        // Full update
        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;

        try {
            $sql = "UPDATE gallery SET 
                        title_id = :title_id, 
                        title_en = :title_en, 
                        category = :category, 
                        image_url = :image_url, 
                        is_active = :is_active 
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $input['id'],
                'title_id' => $input['title_id'] ?? 'Foto Galeri',
                'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Gallery Photo'),
                'category' => $input['category'] ?? 'property',
                'image_url' => $input['image_url'],
                'is_active' => $isActive
            ]);
        } catch (PDOException $e) {
            // Fallback for legacy schema
            $sql = "UPDATE gallery SET 
                        title_id = :title_id, 
                        title_en = :title_en, 
                        category = :category, 
                        image_url = :image_url 
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $input['id'],
                'title_id' => $input['title_id'] ?? 'Foto Galeri',
                'title_en' => $input['title_en'] ?? ($input['title_id'] ?? 'Gallery Photo'),
                'category' => $input['category'] ?? 'property',
                'image_url' => $input['image_url']
            ]);
        }

        echo json_encode(["status" => "success", "message" => "Foto galeri berhasil diperbarui."]);
        break;

    case 'DELETE':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Gallery item ID is required."]);
            exit();
        }

        $fetchStmt = $pdo->prepare("SELECT image_url FROM gallery WHERE id = :id LIMIT 1");
        $fetchStmt->execute(['id' => $id]);
        $item = $fetchStmt->fetch();
        if ($item && !empty($item['image_url'])) {
            deleteUploadedImage($item['image_url']);
        }

        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Foto galeri berhasil dihapus."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
