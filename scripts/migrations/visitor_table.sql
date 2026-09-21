-- ==============================================================================
-- Kasilapa Bay - Visitor Analytics Table for Hostinger phpMyAdmin
-- Jalankan query ini di tab 'SQL' pada phpMyAdmin database Anda di Hostinger
-- ==============================================================================

-- 1. Jika tabel 'site_visitors' belum ada sama sekali, jalankan CREATE TABLE ini:
CREATE TABLE IF NOT EXISTS `site_visitors` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(64) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `page_url` VARCHAR(255) NOT NULL,
  `page_title` VARCHAR(255) DEFAULT '',
  `referrer` VARCHAR(255) DEFAULT '',
  `device_type` VARCHAR(20) DEFAULT 'desktop', -- mobile, desktop, tablet
  `browser` VARCHAR(50) DEFAULT 'Chrome',
  `operating_system` VARCHAR(50) DEFAULT 'Windows',
  `country_code` VARCHAR(10) DEFAULT 'ID',
  `country_name` VARCHAR(100) DEFAULT 'Indonesia',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_page_url` (`page_url`),
  INDEX `idx_session` (`session_id`),
  INDEX `idx_date_ip` (`created_at`, `ip_address`),
  INDEX `idx_country` (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. JIKA TABEL SUDAH ADA SEBELUMNYA di Hostinger, cukup jalankan baris ALTER TABLE ini saja:
-- ALTER TABLE `site_visitors` 
--   ADD COLUMN `country_code` VARCHAR(10) DEFAULT 'ID' AFTER `operating_system`,
--   ADD COLUMN `country_name` VARCHAR(100) DEFAULT 'Indonesia' AFTER `country_code`,
--   ADD INDEX `idx_country` (`country_code`);

-- Data sampel awal (opsional) dengan variasi negara turis (Indonesia, Australia, Singapura, AS, Malaysia)
INSERT IGNORE INTO `site_visitors` (`session_id`, `ip_address`, `page_url`, `page_title`, `referrer`, `device_type`, `browser`, `operating_system`, `country_code`, `country_name`, `created_at`) VALUES
('sess_demo_1', '180.252.***.***', '/', 'Beranda | Kasilapa Bay', '', 'desktop', 'Chrome', 'Windows', 'ID', 'Indonesia', NOW() - INTERVAL 2 HOUR),
('sess_demo_1', '180.252.***.***', '/kamar', 'Kamar & Akomodasi | Kasilapa Bay', '/', 'desktop', 'Chrome', 'Windows', 'ID', 'Indonesia', NOW() - INTERVAL 1 HOUR - INTERVAL 50 MINUTE),
('sess_demo_2', '114.124.***.***', '/', 'Beranda | Kasilapa Bay', 'https://www.google.com/', 'mobile', 'Mobile Safari', 'iOS', 'ID', 'Indonesia', NOW() - INTERVAL 1 HOUR),
('sess_demo_2', '114.124.***.***', '/destinasi', 'Wisata Sekitar | Kasilapa Bay', '/', 'mobile', 'Mobile Safari', 'iOS', 'ID', 'Indonesia', NOW() - INTERVAL 45 MINUTE),
('sess_demo_3', '1.128.***.***', '/', 'Beranda | Kasilapa Bay', 'https://www.google.com.au/', 'desktop', 'Chrome', 'macOS', 'AU', 'Australia', NOW() - INTERVAL 35 MINUTE),
('sess_demo_3', '1.128.***.***', '/kamar', 'Kamar & Akomodasi | Kasilapa Bay', '/', 'desktop', 'Chrome', 'macOS', 'AU', 'Australia', NOW() - INTERVAL 30 MINUTE),
('sess_demo_4', '118.200.***.***', '/destinasi', 'Wisata Sekitar | Kasilapa Bay', 'https://instagram.com/', 'mobile', 'Mobile Safari', 'iOS', 'SG', 'Singapore', NOW() - INTERVAL 25 MINUTE),
('sess_demo_5', '66.249.***.***', '/fasilitas', 'Fasilitas | Kasilapa Bay', '', 'desktop', 'Firefox', 'Windows', 'US', 'United States', NOW() - INTERVAL 15 MINUTE),
('sess_demo_6', '175.143.***.***', '/kamar/deluxe-room', 'Deluxe Room | Kasilapa Bay', '/kamar', 'mobile', 'Chrome Mobile', 'Android', 'MY', 'Malaysia', NOW() - INTERVAL 5 MINUTE);
