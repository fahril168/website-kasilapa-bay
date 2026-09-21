<?php
// ==============================================================================
// Kasilapa Bay - Visitor Tracker API
// Records lightweight, anonymized pageview logs for Admin Analytics
// ==============================================================================

require_once __DIR__ . '/config.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

try {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    $pageUrl = trim($input['page_url'] ?? '/');
    $pageTitle = trim($input['page_title'] ?? '');
    $referrer = trim($input['referrer'] ?? '');
    $sessionId = trim($input['session_id'] ?? '');

    // Ignore admin panel pageviews from visitor statistics
    if (strpos($pageUrl, '/admin') === 0 || strpos($pageUrl, '/api') === 0) {
        echo json_encode(["status" => "ignored", "message" => "Admin/API routes are excluded from visitor tracking"]);
        exit();
    }

    // Determine Client IP (Handle Cloudflare, Reverse Proxies, and Direct)
    $ip = '127.0.0.1';
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ipList[0]);
    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // Mask IP address for privacy compliance (e.g. 180.252.12.34 -> 180.252.***.***)
    $maskedIp = $ip;
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        $parts = explode('.', $ip);
        if (count($parts) === 4) {
            $maskedIp = $parts[0] . '.' . $parts[1] . '.***.***';
        }
    } elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $parts = explode(':', $ip);
        if (count($parts) >= 2) {
            $maskedIp = $parts[0] . ':' . $parts[1] . ':****:****';
        }
    }

    // Fallback or sanitize session ID
    if (empty($sessionId)) {
        $sessionId = hash('sha256', $ip . '_' . date('Y-m-d') . '_' . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
    }
    $sessionId = substr($sessionId, 0, 64);

    // Parse User-Agent
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

    // Detect Device Type
    $deviceType = 'desktop';
    if (preg_match('/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i', $ua)) {
        $deviceType = 'tablet';
    } elseif (preg_match('/(mobile|ipod|iphone|android|blackberry|opera mini|iemobile|wpdesktop)/i', $ua)) {
        $deviceType = 'mobile';
    }

    // Detect Browser
    $browser = 'Other';
    if (preg_match('/Edg/i', $ua)) {
        $browser = 'Edge';
    } elseif (preg_match('/OPR|Opera/i', $ua)) {
        $browser = 'Opera';
    } elseif (preg_match('/SamsungBrowser/i', $ua)) {
        $browser = 'Samsung Browser';
    } elseif (preg_match('/Chrome/i', $ua)) {
        $browser = ($deviceType === 'mobile') ? 'Chrome Mobile' : 'Chrome';
    } elseif (preg_match('/Safari/i', $ua) && !preg_match('/Chrome/i', $ua)) {
        $browser = ($deviceType === 'mobile') ? 'Mobile Safari' : 'Safari';
    } elseif (preg_match('/Firefox/i', $ua)) {
        $browser = 'Firefox';
    }

    // Detect Operating System
    $os = 'Other';
    if (preg_match('/windows nt 10/i', $ua)) $os = 'Windows 10/11';
    elseif (preg_match('/windows/i', $ua)) $os = 'Windows';
    elseif (preg_match('/iphone|ipad|ipod/i', $ua)) $os = 'iOS';
    elseif (preg_match('/android/i', $ua)) $os = 'Android';
    elseif (preg_match('/macintosh|mac os x/i', $ua)) $os = 'macOS';
    elseif (preg_match('/linux/i', $ua)) $os = 'Linux';

    // Detect Country
    // 1. Check Cloudflare header (instant 0ms)
    $countryCode = '';
    if (!empty($_SERVER['HTTP_CF_IPCOUNTRY']) && strlen($_SERVER['HTTP_CF_IPCOUNTRY']) === 2) {
        $countryCode = strtoupper($_SERVER['HTTP_CF_IPCOUNTRY']);
    }

    // Country name lookup dictionary
    $countryMap = [
        'ID' => 'Indonesia',
        'AU' => 'Australia',
        'SG' => 'Singapore',
        'MY' => 'Malaysia',
        'US' => 'United States',
        'GB' => 'United Kingdom',
        'DE' => 'Germany',
        'NL' => 'Netherlands',
        'FR' => 'France',
        'JP' => 'Japan',
        'KR' => 'South Korea',
        'CN' => 'China',
        'NZ' => 'New Zealand',
        'CA' => 'Canada',
        'IT' => 'Italy',
        'ES' => 'Spain',
        'CH' => 'Switzerland',
        'RU' => 'Russia',
        'IN' => 'India',
        'PH' => 'Philippines',
        'TH' => 'Thailand',
    ];

    // 2. Fallback to client input or timezone if Cloudflare header not present
    $clientCountry = trim($input['country_code'] ?? '');
    $clientTimezone = trim($input['timezone'] ?? '');

    if (empty($countryCode) && !empty($clientCountry) && strlen($clientCountry) === 2) {
        $countryCode = strtoupper($clientCountry);
    }

    if (empty($countryCode) && !empty($clientTimezone)) {
        if (preg_match('/(Jakarta|Makassar|Jayapura|Pontianak)/i', $clientTimezone)) $countryCode = 'ID';
        elseif (preg_match('/(Sydney|Melbourne|Brisbane|Perth|Adelaide|Hobart|Darwin)/i', $clientTimezone)) $countryCode = 'AU';
        elseif (preg_match('/(Singapore)/i', $clientTimezone)) $countryCode = 'SG';
        elseif (preg_match('/(Kuala_Lumpur|Kuching)/i', $clientTimezone)) $countryCode = 'MY';
        elseif (preg_match('/(New_York|Los_Angeles|Chicago|Denver|Phoenix|Anchorage|Honolulu)/i', $clientTimezone)) $countryCode = 'US';
        elseif (preg_match('/(London)/i', $clientTimezone)) $countryCode = 'GB';
        elseif (preg_match('/(Berlin|Frankfurt)/i', $clientTimezone)) $countryCode = 'DE';
        elseif (preg_match('/(Amsterdam)/i', $clientTimezone)) $countryCode = 'NL';
        elseif (preg_match('/(Paris)/i', $clientTimezone)) $countryCode = 'FR';
        elseif (preg_match('/(Tokyo)/i', $clientTimezone)) $countryCode = 'JP';
    }

    // Default fallback to Indonesia
    if (empty($countryCode) || $countryCode === 'XX' || $countryCode === 'T1') {
        $countryCode = 'ID';
    }

    $countryName = $countryMap[$countryCode] ?? (trim($input['country_name'] ?? '') ?: 'Indonesia');

    // Insert to database using PDO Prepared Statements
    $pdo = getDbConnection();

    // Try inserting with country_code & country_name (resilient to schema without country columns)
    try {
        $sql = "INSERT INTO site_visitors 
                (session_id, ip_address, page_url, page_title, referrer, device_type, browser, operating_system, country_code, country_name) 
                VALUES (:session_id, :ip_address, :page_url, :page_title, :referrer, :device_type, :browser, :operating_system, :country_code, :country_name)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'session_id' => $sessionId,
            'ip_address' => substr($maskedIp, 0, 45),
            'page_url' => substr($pageUrl, 0, 255),
            'page_title' => substr($pageTitle, 0, 255),
            'referrer' => substr($referrer, 0, 255),
            'device_type' => $deviceType,
            'browser' => $browser,
            'operating_system' => $os,
            'country_code' => substr($countryCode, 0, 10),
            'country_name' => substr($countryName, 0, 100),
        ]);
    } catch (Exception $colEx) {
        // Fallback to legacy insert without country columns if table not migrated yet
        $sqlLegacy = "INSERT INTO site_visitors 
                      (session_id, ip_address, page_url, page_title, referrer, device_type, browser, operating_system) 
                      VALUES (:session_id, :ip_address, :page_url, :page_title, :referrer, :device_type, :browser, :operating_system)";
        $stmtLegacy = $pdo->prepare($sqlLegacy);
        $stmtLegacy->execute([
            'session_id' => $sessionId,
            'ip_address' => substr($maskedIp, 0, 45),
            'page_url' => substr($pageUrl, 0, 255),
            'page_title' => substr($pageTitle, 0, 255),
            'referrer' => substr($referrer, 0, 255),
            'device_type' => $deviceType,
            'browser' => $browser,
            'operating_system' => $os,
        ]);
    }

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Visit tracked", "country" => $countryCode]);
} catch (Exception $e) {
    // Fail silently with 200 response so visitor browsing is never disrupted
    http_response_code(200);
    echo json_encode(["status" => "error", "message" => "Tracking omitted: " . $e->getMessage()]);
}
