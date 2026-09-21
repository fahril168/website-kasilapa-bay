<?php
// ==============================================================================
// Kasilapa Bay - Contact & Social Media API Endpoint
// Dedicated endpoint for managing primary & secondary phone numbers, email,
// physical address, and official social media URLs with individual active toggles.
// ==============================================================================

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM contacts WHERE id = 1 LIMIT 1");
        $contacts = $stmt->fetch();
        if (!$contacts) {
            $contacts = [
                "phone_primary" => "6282112345678",
                "phone_secondary" => "6281234567890",
                "email" => "hello@kasilapahotel.com",
                "address" => "Desa Kasilapa, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia",
                "instagram_url" => "https://instagram.com/kasilapahoteltomia",
                "instagram_username" => "@kasilapahoteltomia",
                "instagram_active" => 1,
                "facebook_url" => "",
                "facebook_active" => 0,
                "tiktok_url" => "",
                "tiktok_active" => 0
            ];
        } else {
            // Ensure integer types for active flags & default username
            $contacts['instagram_username'] = $contacts['instagram_username'] ?? '@kasilapahoteltomia';
            $contacts['instagram_active'] = (int)($contacts['instagram_active'] ?? 1);
            $contacts['facebook_active']  = (int)($contacts['facebook_active'] ?? 0);
            $contacts['tiktok_active']    = (int)($contacts['tiktok_active'] ?? 0);
        }
        echo json_encode(["status" => "success", "data" => $contacts]);
        break;

    case 'POST':
    case 'PUT':
        verifyAdminToken();
        $input = json_decode(file_get_contents('php://input'), true);

        // Sanitize Instagram username
        $ig_user = trim($input['instagram_username'] ?? '');
        if (empty($ig_user)) {
            $ig_url = trim($input['instagram_url'] ?? '');
            if (!empty($ig_url)) {
                $path = trim(parse_url($ig_url, PHP_URL_PATH) ?? '', '/');
                $parts = explode('/', $path);
                $ig_user = !empty($parts[0]) ? '@' . ltrim($parts[0], '@') : '@kasilapahoteltomia';
            } else {
                $ig_user = '@kasilapahoteltomia';
            }
        } else if ($ig_user[0] !== '@') {
            $ig_user = '@' . $ig_user;
        }

        $sql = "INSERT INTO contacts (id, phone_primary, phone_secondary, email, address, instagram_url, instagram_username, instagram_active, facebook_url, facebook_active, tiktok_url, tiktok_active) 
                VALUES (1, :phone_primary, :phone_secondary, :email, :address, :instagram_url, :instagram_username, :instagram_active, :facebook_url, :facebook_active, :tiktok_url, :tiktok_active)
                ON DUPLICATE KEY UPDATE 
                    phone_primary = VALUES(phone_primary),
                    phone_secondary = VALUES(phone_secondary),
                    email = VALUES(email),
                    address = VALUES(address),
                    instagram_url = VALUES(instagram_url),
                    instagram_username = VALUES(instagram_username),
                    instagram_active = VALUES(instagram_active),
                    facebook_url = VALUES(facebook_url),
                    facebook_active = VALUES(facebook_active),
                    tiktok_url = VALUES(tiktok_url),
                    tiktok_active = VALUES(tiktok_active)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'phone_primary' => preg_replace('/[^0-9]/', '', $input['phone_primary'] ?? ($input['whatsapp_number'] ?? '6282112345678')),
            'phone_secondary' => preg_replace('/[^0-9]/', '', $input['phone_secondary'] ?? ($input['whatsapp_number_secondary'] ?? '')),
            'email' => trim($input['email'] ?? 'hello@kasilapahotel.com'),
            'address' => trim($input['address'] ?? ''),
            'instagram_url' => trim($input['instagram_url'] ?? 'https://instagram.com/kasilapahoteltomia'),
            'instagram_username' => $ig_user,
            'instagram_active' => (!empty($input['instagram_active']) && $input['instagram_active'] != '0') ? 1 : 0,
            'facebook_url' => trim($input['facebook_url'] ?? ''),
            'facebook_active' => (!empty($input['facebook_active']) && $input['facebook_active'] != '0') ? 1 : 0,
            'tiktok_url' => trim($input['tiktok_url'] ?? ''),
            'tiktok_active' => (!empty($input['tiktok_active']) && $input['tiktok_active'] != '0') ? 1 : 0
        ]);

        echo json_encode(["status" => "success", "message" => "Informasi kontak berhasil diperbarui."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed."]);
        break;
}
