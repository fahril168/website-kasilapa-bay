<?php
// ==============================================================================
// Kasilapa Bay - Site Settings & About Us API Endpoint
// Manages About Us headlines and descriptions for both ID and EN.
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Ensure about_images column exists safely across all MySQL versions
try {
    $pdo->query("SELECT about_images FROM site_settings LIMIT 1");
} catch (Exception $e) {
    try {
        $pdo->exec("ALTER TABLE site_settings ADD COLUMN about_images TEXT DEFAULT NULL");
    } catch (Exception $ex) {}
}

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, about_headline_id, about_description_id, about_headline_en, about_description_en, about_images, updated_at FROM site_settings WHERE id = 1 LIMIT 1");
        $settings = $stmt->fetch();
        if (!$settings) {
            $settings = [
                "about_headline_id" => "Kenyamanan Terbaik di Pulau Tomia",
                "about_description_id" => "Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat, pelayanan ramah, dan harga yang bersahabat. Baik Anda seorang backpacker, turis, wisatawan, maupun keluarga yang berlibur bersama, Kasilapa Bay menghadirkan suasana hangat serasa di rumah sendiri.",
                "about_headline_en" => "Best Comfort in Tomia Island",
                "about_description_en" => "Kasilapa Bay is a preferred accommodation in Wakatobi blending comfort, friendly hospitality, and affordable pricing. Whether you are a solo backpacker, adventurer, or traveling family, Kasilapa Bay offers a warm atmosphere feeling just like home.",
                "about_images" => []
            ];
        } else {
            $images = !empty($settings['about_images']) ? json_decode($settings['about_images'], true) : [];
            $settings['about_images'] = is_array($images) ? $images : [];
        }
        echo json_encode(["status" => "success", "data" => $settings]);
        break;

    case 'POST':
    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $aboutImagesJson = isset($input['about_images'])
            ? (is_array($input['about_images']) ? json_encode(array_values(array_filter($input['about_images']))) : $input['about_images'])
            : json_encode([]);

        $sql = "INSERT INTO site_settings (id, about_headline_id, about_description_id, about_headline_en, about_description_en, about_images) 
                VALUES (1, :about_headline_id, :about_description_id, :about_headline_en, :about_description_en, :about_images)
                ON DUPLICATE KEY UPDATE 
                    about_headline_id = VALUES(about_headline_id),
                    about_description_id = VALUES(about_description_id),
                    about_headline_en = VALUES(about_headline_en),
                    about_description_en = VALUES(about_description_en),
                    about_images = VALUES(about_images)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'about_headline_id' => $input['about_headline_id'] ?? '',
            'about_description_id' => $input['about_description_id'] ?? '',
            'about_headline_en' => $input['about_headline_en'] ?? ($input['about_headline_id'] ?? ''),
            'about_description_en' => $input['about_description_en'] ?? ($input['about_description_id'] ?? ''),
            'about_images' => $aboutImagesJson
        ]);

        echo json_encode(["status" => "success", "message" => "Pengaturan profil & About Us berhasil diperbarui."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
