<?php
// ==============================================================================
// Kasilapa Bay - Visitor Analytics & Stats API
// Aggregates visitor metrics, traffic charts, and top pages for Admin Dashboard
// ==============================================================================

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

try {
    $pdo = getDbConnection();

    // Check if site_visitors table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'site_visitors'")->fetch();
    if (!$tableCheck) {
        echo json_encode([
            "status" => "error",
            "message" => "Tabel 'site_visitors' belum ada. Silakan jalankan scripts/visitor_table.sql di phpMyAdmin.",
            "data" => null
        ]);
        exit();
    }

    $days = isset($_GET['days']) ? intval($_GET['days']) : 7;
    if ($days < 1) $days = 7;
    if ($days > 90) $days = 90;

    // 1. Overview Metrics (Today, Yesterday, Period, All-time)
    $todayQuery = $pdo->query("
        SELECT 
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors 
        WHERE DATE(created_at) = CURDATE()
    ")->fetch();

    $yesterdayQuery = $pdo->query("
        SELECT 
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors 
        WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    ")->fetch();

    $stmtPeriod = $pdo->prepare("
        SELECT 
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
    ");
    $stmtPeriod->execute(['days' => $days]);
    $periodQuery = $stmtPeriod->fetch();

    $allTimeQuery = $pdo->query("
        SELECT 
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors
    ")->fetch();

    // 2. Daily Trend Chart (for the selected period)
    $stmtDaily = $pdo->prepare("
        SELECT 
            DATE(created_at) as date_val,
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL :days - 1 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date_val ASC
    ");
    $stmtDaily->execute(['days' => $days]);
    $dailyResults = $stmtDaily->fetchAll(PDO::FETCH_KEY_PAIR ? PDO::FETCH_ASSOC : PDO::FETCH_ASSOC);

    // Map results by date key for gap-filling
    $dailyMap = [];
    foreach ($dailyResults as $row) {
        $dailyMap[$row['date_val']] = [
            'views' => intval($row['views']),
            'visitors' => intval($row['visitors'])
        ];
    }

    // Fill all days in range so chart is continuous
    $dailyTrend = [];
    for ($i = $days - 1; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i days"));
        $label = date('d M', strtotime($d));
        $views = isset($dailyMap[$d]) ? $dailyMap[$d]['views'] : 0;
        $visitors = isset($dailyMap[$d]) ? $dailyMap[$d]['visitors'] : 0;
        $dailyTrend[] = [
            'date' => $d,
            'label' => $label,
            'views' => $views,
            'visitors' => $visitors
        ];
    }

    // 3. Top Visited Pages
    $stmtPages = $pdo->prepare("
        SELECT 
            page_url,
            MAX(page_title) as title,
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as visitors
        FROM site_visitors
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
        GROUP BY page_url
        ORDER BY views DESC
        LIMIT 6
    ");
    $stmtPages->execute(['days' => $days]);
    $topPages = $stmtPages->fetchAll();

    $totalPeriodViews = intval($periodQuery['views'] ?? 1);
    if ($totalPeriodViews <= 0) $totalPeriodViews = 1;

    foreach ($topPages as &$p) {
        $p['percentage'] = round((intval($p['views']) / $totalPeriodViews) * 100, 1);
    }
    unset($p);

    // 4. Device Distribution
    $stmtDevices = $pdo->prepare("
        SELECT 
            device_type,
            COUNT(*) as count
        FROM site_visitors
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
        GROUP BY device_type
        ORDER BY count DESC
    ");
    $stmtDevices->execute(['days' => $days]);
    $devices = $stmtDevices->fetchAll();
    foreach ($devices as &$dev) {
        $dev['percentage'] = round((intval($dev['count']) / $totalPeriodViews) * 100, 1);
    }
    unset($dev);

    // 5. Browser Distribution
    $stmtBrowsers = $pdo->prepare("
        SELECT 
            browser,
            COUNT(*) as count
        FROM site_visitors
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
        GROUP BY browser
        ORDER BY count DESC
        LIMIT 5
    ");
    $stmtBrowsers->execute(['days' => $days]);
    $browsers = $stmtBrowsers->fetchAll();
    foreach ($browsers as &$br) {
        $br['percentage'] = round((intval($br['count']) / $totalPeriodViews) * 100, 1);
    }
    unset($br);

    // 6. Top Countries Distribution
    $topCountries = [];
    try {
        $stmtCountries = $pdo->prepare("
            SELECT 
                COALESCE(NULLIF(country_code, ''), 'ID') as country_code,
                COALESCE(NULLIF(country_name, ''), 'Indonesia') as country_name,
                COUNT(DISTINCT session_id) as visitors,
                COUNT(*) as views
            FROM site_visitors
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
            GROUP BY country_code, country_name
            ORDER BY visitors DESC, views DESC
            LIMIT 5
        ");
        $stmtCountries->execute(['days' => $days]);
        $topCountries = $stmtCountries->fetchAll();

        $totalPeriodVisitors = intval($periodQuery['visitors'] ?? 1);
        if ($totalPeriodVisitors <= 0) $totalPeriodVisitors = 1;

        foreach ($topCountries as &$c) {
            $c['visitors'] = intval($c['visitors']);
            $c['views'] = intval($c['views']);
            $c['percentage'] = round(($c['visitors'] / $totalPeriodVisitors) * 100, 1);
        }
        unset($c);
    } catch (Exception $countryEx) {
        // Graceful fallback if column doesn't exist yet on Hostinger
        $topCountries = [
            [
                'country_code' => 'ID',
                'country_name' => 'Indonesia',
                'visitors' => intval($periodQuery['visitors'] ?? 1),
                'views' => intval($periodQuery['views'] ?? 1),
                'percentage' => 100.0
            ]
        ];
    }

    // 7. Recent Visitor Logs (last 15 visits)
    $recentLogs = [];
    try {
        $stmtRecent = $pdo->query("
            SELECT 
                id,
                ip_address,
                page_url,
                page_title,
                device_type,
                browser,
                operating_system,
                country_code,
                country_name,
                referrer,
                created_at
            FROM site_visitors
            ORDER BY id DESC
            LIMIT 15
        ");
        $recentLogs = $stmtRecent->fetchAll();
    } catch (Exception $recentEx) {
        $stmtRecent = $pdo->query("
            SELECT 
                id,
                ip_address,
                page_url,
                page_title,
                device_type,
                browser,
                operating_system,
                'ID' as country_code,
                'Indonesia' as country_name,
                referrer,
                created_at
            FROM site_visitors
            ORDER BY id DESC
            LIMIT 15
        ");
        $recentLogs = $stmtRecent->fetchAll();
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "period_days" => $days,
            "metrics" => [
                "today_views" => intval($todayQuery['views'] ?? 0),
                "today_visitors" => intval($todayQuery['visitors'] ?? 0),
                "yesterday_views" => intval($yesterdayQuery['views'] ?? 0),
                "yesterday_visitors" => intval($yesterdayQuery['visitors'] ?? 0),
                "period_views" => intval($periodQuery['views'] ?? 0),
                "period_visitors" => intval($periodQuery['visitors'] ?? 0),
                "total_views" => intval($allTimeQuery['views'] ?? 0),
                "total_visitors" => intval($allTimeQuery['visitors'] ?? 0),
            ],
            "daily_trend" => $dailyTrend,
            "top_pages" => $topPages,
            "top_countries" => $topCountries,
            "devices" => $devices,
            "browsers" => $browsers,
            "recent_logs" => $recentLogs
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data statistik: " . $e->getMessage()
    ]);
}
