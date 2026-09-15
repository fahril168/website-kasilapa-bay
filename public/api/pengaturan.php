<?php
// ==============================================================================
// Kasilapa Bay - Site Settings & About Us API Endpoint
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM site_settings WHERE id = 1 LIMIT 1");
        $settings = $stmt->fetch();
        if (!$settings) {
            $settings = [
                "about_headline_id" => "Kenyamanan Terbaik di Pulau Tomia",
                "about_description_id" => "Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat...",
                "whatsapp_number" => "6282112345678",
                "email" => "hello@kasilapabay.com",
                "address" => "Pulau Tomia, Wakatobi, Indonesia",
                "instagram_url" => "https://instagram.com/kasilapabay",
                "facebook_url" => "https://facebook.com/kasilapabay",
                "tiktok_url" => "https://tiktok.com/@kasilapabay"
            ];
        }
        echo json_encode(["status" => "success", "data" => $settings]);
        break;

    case 'POST':
    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        $sql = "INSERT INTO site_settings (id, about_headline_id, about_description_id, about_headline_en, about_description_en, whatsapp_number, email, address, instagram_url, facebook_url, tiktok_url) 
                VALUES (1, :about_headline_id, :about_description_id, :about_headline_en, :about_description_en, :whatsapp_number, :email, :address, :instagram_url, :facebook_url, :tiktok_url)
                ON DUPLICATE KEY UPDATE 
                    about_headline_id = VALUES(about_headline_id),
                    about_description_id = VALUES(about_description_id),
                    about_headline_en = VALUES(about_headline_en),
                    about_description_en = VALUES(about_description_en),
                    whatsapp_number = VALUES(whatsapp_number),
                    email = VALUES(email),
                    address = VALUES(address),
                    instagram_url = VALUES(instagram_url),
                    facebook_url = VALUES(facebook_url),
                    tiktok_url = VALUES(tiktok_url)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'about_headline_id' => $input['about_headline_id'] ?? '',
            'about_description_id' => $input['about_description_id'] ?? '',
            'about_headline_en' => $input['about_headline_en'] ?? ($input['about_headline_id'] ?? ''),
            'about_description_en' => $input['about_description_en'] ?? ($input['about_description_id'] ?? ''),
            'whatsapp_number' => preg_replace('/[^0-9]/', '', $input['whatsapp_number'] ?? '6282112345678'),
            'email' => $input['email'] ?? '',
            'address' => $input['address'] ?? '',
            'instagram_url' => $input['instagram_url'] ?? '',
            'facebook_url' => $input['facebook_url'] ?? '',
            'tiktok_url' => $input['tiktok_url'] ?? ''
        ]);

        echo json_encode(["status" => "success", "message" => "Pengaturan & About Us berhasil diperbarui."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
