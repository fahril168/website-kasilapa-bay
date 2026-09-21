-- ==============================================================================
-- Kasilapa Bay - MySQL Complete Database Schema for Hostinger phpMyAdmin
-- 100% Matched with current Kasilapa Bay website content (id.json & en.json)
-- ==============================================================================

-- Note: Di Hostinger phpMyAdmin, pilih database Anda terlebih dahulu sebelum import.
-- Baris CREATE DATABASE dan USE di-comment agar tidak terjadi error 'Access Denied' pada shared hosting.
-- CREATE DATABASE IF NOT EXISTS `kasilapa_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `kasilapa_db`;

-- 1. Table: admin_users (Stores Admin credentials securely with BCRYPT hash)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `session_token` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `admin_users` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'admin', 'admin@kasilapahotel.com', '$2y$10$AHKgmePhnlUR0LYA1kGtp.ACQw88KSzOJYuhGPB2bXvO/cyvMDaqO');

-- 2. Table: rooms (Stores accommodation / room data)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_id` VARCHAR(100) NOT NULL,
  `title_en` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `price_per_night` DECIMAL(12, 2) NOT NULL,
  `capacity` INT NOT NULL DEFAULT 2,
  `bed_type` VARCHAR(50) NOT NULL DEFAULT 'King Bed',
  `image_url` VARCHAR(255) NOT NULL,
  `description_id` TEXT,
  `description_en` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `rooms` (`id`, `title_id`, `title_en`, `slug`, `price_per_night`, `capacity`, `bed_type`, `image_url`, `description_id`, `description_en`) VALUES
(1, 'Standart Room', 'Standard Room', 'standart-room', 250000.00, 2, 'Double Bed', '/img/room.webp', 'Tipe kamar ini merupakan opsi paling ekonomis, biasanya ditujukan untuk solo traveler atau dua orang yang menginginkan akomodasi standar.', 'The most economical option, perfect for solo travelers or couples looking for standard accommodation.'),
(2, 'Deluxe Room', 'Deluxe Room', 'deluxe-room', 300000.00, 2, 'King Bed', '/img/room.webp', 'Tipe kamar dengan ukuran ruang yang lebih lapang dan penataan yang lebih nyaman untuk istirahat maksimal selama berada di Pulau Tomia.', 'Spacious room with a comfortable layout designed for maximum relaxation during your stay on Tomia Island.');

-- 3. Table: destinations (Stores tourist spots & diving sites around Tomia)
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_id` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Alam',
  `description_id` TEXT,
  `description_en` TEXT,
  `distance` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `info_url` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `destinations` (`id`, `name_id`, `name_en`, `category`, `description_id`, `description_en`, `distance`, `image_url`, `info_url`) VALUES
(1, 'Puncak Kahianga', 'Kahianga Peak', 'Pemandangan Alam', 'Titik tertinggi di Tomia dengan pemandangan laut biru tak berujung, bukit sabana yang hijau, dan sunset yang indah.', 'The highest point in Tomia with endless blue ocean views, green savanna hills, and beautiful sunsets.', '10 menit berkendara', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg', 'https://www.wakatobitourism.com/item/kahianga-peak/'),
(2, 'Desa Kulati', 'Kulati Village', 'Sejarah & Budaya', 'Desa wisata berbasis masyarakat dengan keindahan pantai tebing karang seperti Pantai Huntete yang eksotis.', 'A community-based tourism village with exotic coral cliff beaches such as Huntete Beach.', '20 menit berkendara', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg', 'https://www.wakatobitourism.com/item/kulati-village/'),
(3, 'Pulau Lentea', 'Lintea Island', 'Pantai', 'Pulau tetangga berpasir putih halus yang dikelilingi pohon kelapa menjulang tinggi dan air laut yang sangat jernih.', 'A neighboring island with fine white sand surrounded by tall coconut trees and crystal-clear water.', '30 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Pulau-Lentea-Tomia-49-428x242.jpg', 'https://www.wakatobitourism.com/item/lintea-island/'),
(4, 'Roma', 'Roma Dive Site', 'Diving', 'Spot menyelam paling populer dengan ribuan schooling fish yang mengitari puncak terumbu karang melingkar besar.', 'The most popular dive spot featuring thousands of schooling fish circling a large coral pinnacle.', '15 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg', 'https://www.wakatobitourism.com/item/roma/'),
(5, 'Pulau Nda\'a', 'Nda\'a Island', 'Pantai', 'Pulau tak berpenghuni dengan pantai berpasir selembut tepung dan ekosistem terumbu karang yang sangat dangkal dan utuh.', 'An uninhabited island with powdery white sand beaches and intact shallow coral reef ecosystems.', '40 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Ndaa-Island-by-Guntur-2-428x242.jpg', 'https://www.wakatobitourism.com/item/ndaa-island/'),
(6, 'Benteng Patua', 'Patua Fort', 'Sejarah & Budaya', 'Benteng bersejarah peninggalan Kesultanan Buton di puncak bukit batu karang Tomia yang menyuguhkan lanskap spektakuler.', 'A historic fort from the Buton Sultanate on Tomia\'s coral hill offering spectacular landscapes.', '18 menit berkendara', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Patua-Fort-by-Amal-Hermawan-428x242.jpg', 'https://www.wakatobitourism.com/item/patua-fort/'),
(7, 'Ali Reef', 'Ali Reef', 'Diving', 'Spot menyelam populer yang terkenal dengan kawanan besar ikan schooling fish yang berenang bebas di antara terumbu karang.', 'Popular dive spot known for large schools of fish swimming freely among vibrant corals.', '20 menit perahu', 'https://www.wakatobitocurrency.com/wp-content/uploads/2018/04/Fish-Schooling-by-DCDC-min-428x242.jpg', 'https://www.wakatobitourism.com/item/ali-reef/'),
(8, 'Kolosuha', 'Kolosuha', 'Diving', 'Tebing terumbu karang bawah laut yang curam di sisi barat Tomia, dipenuhi keanekaragaman biota laut.', 'A steep underwater coral reef wall on Tomia\'s west side filled with diverse marine life.', '18 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Kolosuha-by-Wakatobi-Regency-428x242.jpg', 'https://www.wakatobitourism.com/item/kolosuha/'),
(9, 'Mari Mabuk', 'Mari Mabuk', 'Diving', 'Salah satu titik selam favorit dengan pemandangan terumbu karang warna-warni dan arus air yang bersahabat.', 'A favorite dive spot featuring colorful coral reef views and gentle water currents.', '15 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/05/Mari-Mabuk-by-Hendra-Tan-min-1-428x242.jpg', 'https://www.wakatobitourism.com/item/mari-mabuk/'),
(10, 'Wreck of Kulati', 'Wreck of Kulati', 'Diving', 'Bangkai kapal karam bersejarah di kedalaman laut dekat Kulati yang kini bertransformasi menjadi rumah bagi terumbu karang indah.', 'A historic shipwreck in deep waters near Kulati now transformed into a home for vibrant corals.', '25 menit perahu', 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Wreck-Kulati-by-Guntur-428x242.jpg', 'https://www.wakatobitourism.com/item/wreck-of-kulati/');

-- 4. Table: images (Centralized Media Library - stores all room, destination, and gallery images)
CREATE TABLE IF NOT EXISTS `images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `alt_text_id` VARCHAR(255) DEFAULT NULL,
  `alt_text_en` VARCHAR(255) DEFAULT NULL,
  `source` ENUM('upload', 'external', 'seed') NOT NULL DEFAULT 'seed',
  `category` VARCHAR(50) DEFAULT 'property',
  `is_active` TINYINT(1) DEFAULT 1,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4b. Table: room_images (Many-to-Many junction between rooms and images)
CREATE TABLE IF NOT EXISTS `room_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT NOT NULL,
  `image_id` INT NOT NULL,
  `is_cover` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4c. Table: destination_images (Many-to-Many junction between destinations and images)
CREATE TABLE IF NOT EXISTS `destination_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `destination_id` INT NOT NULL,
  `image_id` INT NOT NULL,
  `is_cover` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Seed for Images
INSERT IGNORE INTO `images` (`id`, `url`, `thumbnail_url`, `alt_text_id`, `alt_text_en`, `category`, `source`, `is_active`) VALUES
(1, '/img/room.webp', '/img/room.webp', 'Standart Room', 'Standard Room', 'property', 'seed', 1),
(2, '/img/hero.webp', '/img/hero.webp', 'Deluxe Room', 'Deluxe Room', 'property', 'seed', 1),
(4, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg', NULL, 'Puncak Kahianga', 'Kahianga Peak', 'island', 'external', 1),
(5, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg', NULL, 'Desa Kulati', 'Kulati Village', 'island', 'external', 1),
(6, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Pulau-Lentea-Tomia-49-428x242.jpg', NULL, 'Pulau Lentea', 'Lintea Island', 'island', 'external', 1),
(7, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg', NULL, 'Roma', 'Roma Dive Site', 'island', 'external', 1),
(8, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Ndaa-Island-by-Guntur-2-428x242.jpg', NULL, 'Pulau Nda\'a', 'Nda\'a Island', 'island', 'external', 1),
(9, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Patua-Fort-by-Amal-Hermawan-428x242.jpg', NULL, 'Benteng Patua', 'Patua Fort', 'island', 'external', 1),
(10, 'https://www.wakatobitocurrency.com/wp-content/uploads/2018/04/Fish-Schooling-by-DCDC-min-428x242.jpg', NULL, 'Ali Reef', 'Ali Reef', 'island', 'external', 1),
(11, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Kolosuha-by-Wakatobi-Regency-428x242.jpg', NULL, 'Kolosuha', 'Kolosuha', 'island', 'external', 1),
(12, 'https://www.wakatobitourism.com/wp-content/uploads/2018/05/Mari-Mabuk-by-Hendra-Tan-min-1-428x242.jpg', NULL, 'Mari Mabuk', 'Mari Mabuk', 'island', 'external', 1),
(13, 'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Wreck-Kulati-by-Guntur-428x242.jpg', NULL, 'Wreck of Kulati', 'Wreck of Kulati', 'island', 'external', 1);

-- Initial Junction Relations
INSERT IGNORE INTO `room_images` (`room_id`, `image_id`, `is_cover`, `sort_order`) VALUES
(1, 1, 1, 0),
(2, 2, 1, 0);

INSERT IGNORE INTO `destination_images` (`destination_id`, `image_id`, `is_cover`, `sort_order`) VALUES
(1, 4, 1, 0),
(2, 5, 1, 0),
(3, 6, 1, 0),
(4, 7, 1, 0),
(5, 8, 1, 0),
(6, 9, 1, 0),
(7, 10, 1, 0),
(8, 11, 1, 0),
(9, 12, 1, 0),
(10, 13, 1, 0);

-- 5. Table: reviews (Stores guest reviews & testimonials)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `guest_name` VARCHAR(100) NOT NULL,
  `origin` VARCHAR(100) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment_id` TEXT NOT NULL,
  `comment_en` TEXT NOT NULL,
  `is_visible` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `reviews` (`id`, `guest_name`, `origin`, `rating`, `comment_id`, `comment_en`, `is_visible`) VALUES
(1, 'Putri Kitnas', 'Depok, Indonesia', 5, 'Rasanya seperti di rumah. Ibu dan Bapak Haji menjadikan kami seperti mengunjungi keluarga daripada menginap di hotel. Saya memiliki harapan yang rendah sebelum datang, namun tempat ini sangat cocok dalam hal kebersihan, kenyamanan, lokasi, dan makanan.', 'Feels just like home. Ibu and Bapak Haji treated us like visiting family rather than hotel guests. Very clean, comfortable, great location and delicious food.', 1),
(2, 'Lelie Liana', 'Bali, Indonesia', 5, 'Hotelnya nyaman. Kamarnya luas. Lokasi hotelnya juga di tempat yang sepi dan tidak ramai jalur kendaraan. Kamar di ujung sangat luas dan menghadap laut. Udara dan angin banyak. Saya sangat suka. Masakan Ibu pemilik hotel sangat enak.', 'Comfortable hotel with spacious rooms in a peaceful location away from busy traffic. The corner room faces the sea with great fresh ocean breezes. Delicious homemade meals.', 1),
(3, 'famokossatour', 'Indonesia', 5, 'Jika anda sedang merencanakan untuk berlibur di Pulau Tomia, Kasilapa Bay Hotel menjadi rekomendasi utama untuk akomodasi selama berada di sana. Selain kenyamanan serta keramahan pelayanan, Kasilapa Bay Hotel juga menawarkan pemandangan yang indah tepat di teluk Kasilapa.', 'If you are planning a trip to Tomia Island, Kasilapa Bay Hotel is the top recommendation for accommodation. Great hospitality, clean environment, and beautiful scenery right on Kasilapa bay.', 1),
(4, 'Anne Mbouw', 'Indonesia', 5, 'Langsung dijemput dari pelabuhan, kamar bersih & nyaman, serta suasana sore di halaman belakang sungguh indah. Penginapan ini seperti rumah sendiri, dengan teras santai dan tuan rumah yang sangat ramah.', 'Picked up directly from the harbor, clean & cozy rooms, and lovely afternoon atmosphere in the backyard. Host family is super warm and friendly.', 1);

-- 6. Table: facilities (Stores resort amenities)
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_id` VARCHAR(100) NOT NULL,
  `title_en` VARCHAR(100) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'wifi',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `facilities` (`id`, `title_id`, `title_en`, `icon_name`, `is_active`) VALUES
(1, 'WiFi Gratis', 'Free WiFi', 'wifi', 1),
(2, 'Sarapan Lokal', 'Local Breakfast', 'breakfast', 1),
(3, 'Sewa Mobil', 'Car Rental', 'car', 1),
(4, 'Sewa Motor', 'Bike Rental', 'bike', 1),
(5, 'Parkir', 'Parking', 'parking', 1),
(6, 'Laundry', 'Laundry', 'laundry', 1),
(7, 'Listrik 24 Jam', '24h Electricity', 'electricity', 1),
(8, 'Air Bersih', 'Fresh Water', 'water', 1);

-- 7. Table: site_settings (Stores About Us, WhatsApp Contact & Social Media Info)
-- 7. Table: contacts (Stores phone numbers, WhatsApp, email, address, and social media)
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `phone_primary` VARCHAR(30) NOT NULL DEFAULT '6282112345678',
  `phone_secondary` VARCHAR(30) DEFAULT '6281234567890',
  `email` VARCHAR(100) NOT NULL DEFAULT 'hello@kasilapahotel.com',
  `address` TEXT,
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/kasilapahoteltomia',
  `instagram_username` VARCHAR(100) NOT NULL DEFAULT '@kasilapahoteltomia',
  `instagram_active` TINYINT(1) NOT NULL DEFAULT 1,
  `facebook_url` VARCHAR(255) DEFAULT '',
  `facebook_active` TINYINT(1) NOT NULL DEFAULT 0,
  `tiktok_url` VARCHAR(255) DEFAULT '',
  `tiktok_active` TINYINT(1) NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `contacts` (`id`, `phone_primary`, `phone_secondary`, `email`, `address`, `instagram_url`, `instagram_username`, `instagram_active`, `facebook_url`, `facebook_active`, `tiktok_url`, `tiktok_active`) VALUES
(1, '6282112345678', '6281234567890', 'hello@kasilapahotel.com', 'Desa Kasilapa, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia', 'https://instagram.com/kasilapahoteltomia', '@kasilapahoteltomia', 1, '', 0, '', 0);

-- 8. Table: site_settings (Stores About Us, headlines, and resort profile)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `about_headline_id` TEXT,
  `about_description_id` TEXT,
  `about_headline_en` TEXT,
  `about_description_en` TEXT,
  `about_images` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `site_settings` (`id`, `about_headline_id`, `about_description_id`, `about_headline_en`, `about_description_en`) VALUES
(1, 
 'Kenyamanan Terbaik di Pulau Tomia', 
 'Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat, pelayanan ramah, dan harga yang bersahabat. Baik Anda seorang backpacker, turis, wisatawan, maupun keluarga yang berlibur bersama, Kasilapa Bay menghadirkan suasana hangat serasa di rumah sendiri.',
 'Best Comfort in Tomia Island',
 'Kasilapa Bay is a preferred accommodation in Wakatobi blending comfort, friendly hospitality, and affordable pricing. Whether you are a solo backpacker, adventurer, or traveling family, Kasilapa Bay offers a warm atmosphere feeling just like home.'
);

-- 8. Table: site_visitors (Stores visitor logs and pageview analytics)
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

-- Initial realistic visitor seed data for demonstration in phpMyAdmin
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


