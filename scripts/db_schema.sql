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
(1, 'admin', 'admin@kasilapabay.com', '$2y$10$AHKgmePhnlUR0LYA1kGtp.ACQw88KSzOJYuhGPB2bXvO/cyvMDaqO');

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
(1, 'Standart Room', 'Standard Room', 'standart-room', 250000.00, 2, 'Double Bed', '/img/rooms/1.webp', 'Tipe kamar ini merupakan opsi paling ekonomis, biasanya ditujukan untuk solo traveler atau dua orang yang menginginkan akomodasi standar.', 'The most economical option, perfect for solo travelers or couples looking for standard accommodation.'),
(2, 'Deluxe Room', 'Deluxe Room', 'deluxe-room', 300000.00, 2, 'King Bed', '/img/rooms/2.webp', 'Tipe kamar dengan ukuran ruang yang lebih lapang dan penataan yang lebih nyaman untuk istirahat maksimal selama berada di Pulau Tomia.', 'Spacious room with a comfortable layout designed for maximum relaxation during your stay on Tomia Island.');

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

-- 4. Table: gallery (Stores photo gallery items)
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_id` VARCHAR(100) NOT NULL,
  `title_en` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'property',
  `image_url` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `gallery` (`id`, `title_id`, `title_en`, `category`, `image_url`, `is_active`) VALUES
(1, 'Penginapan Kasilapa Bay 1', 'Kasilapa Bay Homestay 1', 'property', '/img/rooms/1.webp', 1),
(2, 'Penginapan Kasilapa Bay 2', 'Kasilapa Bay Homestay 2', 'property', '/img/rooms/2.webp', 1),
(3, 'Penginapan Kasilapa Bay 3', 'Kasilapa Bay Homestay 3', 'property', '/img/rooms/3.webp', 1),
(4, 'Penginapan Kasilapa Bay 4', 'Kasilapa Bay Homestay 4', 'property', '/img/rooms/4.webp', 1),
(5, 'Penginapan Kasilapa Bay 5', 'Kasilapa Bay Homestay 5', 'property', '/img/rooms/5.webp', 1),
(6, 'Penginapan Kasilapa Bay 6', 'Kasilapa Bay Homestay 6', 'property', '/img/rooms/6.webp', 1),
(7, 'Penginapan Kasilapa Bay 7', 'Kasilapa Bay Homestay 7', 'property', '/img/rooms/7.webp', 1),
(8, 'Penginapan Kasilapa Bay 8', 'Kasilapa Bay Homestay 8', 'property', '/img/rooms/8.webp', 1),
(9, 'Penginapan Kasilapa Bay 9', 'Kasilapa Bay Homestay 9', 'property', '/img/rooms/9.webp', 1),
(10, 'Penginapan Kasilapa Bay 10', 'Kasilapa Bay Homestay 10', 'property', '/img/rooms/10.webp', 1),
(11, 'Penginapan Kasilapa Bay 11', 'Kasilapa Bay Homestay 11', 'property', '/img/rooms/11.webp', 1),
(12, 'Penginapan Kasilapa Bay 12', 'Kasilapa Bay Homestay 12', 'property', '/img/rooms/12.webp', 1),
(13, 'Penginapan Kasilapa Bay 13', 'Kasilapa Bay Homestay 13', 'property', '/img/rooms/13.webp', 1),
(14, 'Penginapan Kasilapa Bay 14', 'Kasilapa Bay Homestay 14', 'property', '/img/rooms/14.webp', 1),
(15, 'Penginapan Kasilapa Bay 15', 'Kasilapa Bay Homestay 15', 'property', '/img/rooms/15.webp', 1),
(16, 'Penginapan Kasilapa Bay 16', 'Kasilapa Bay Homestay 16', 'property', '/img/rooms/16.webp', 1),
(17, 'Penginapan Kasilapa Bay 17', 'Kasilapa Bay Homestay 17', 'property', '/img/rooms/17.webp', 1),
(18, 'Penginapan Kasilapa Bay 18', 'Kasilapa Bay Homestay 18', 'property', '/img/rooms/18.webp', 1),
(19, 'Penginapan Kasilapa Bay 19', 'Kasilapa Bay Homestay 19', 'property', '/img/rooms/19.webp', 1),
(20, 'Penginapan Kasilapa Bay 20', 'Kasilapa Bay Homestay 20', 'property', '/img/rooms/20.webp', 1),
(21, 'Penginapan Kasilapa Bay 21', 'Kasilapa Bay Homestay 21', 'property', '/img/rooms/21.webp', 1),
(22, 'Penginapan Kasilapa Bay 22', 'Kasilapa Bay Homestay 22', 'property', '/img/rooms/22.webp', 1),
(23, 'Penginapan Kasilapa Bay 23', 'Kasilapa Bay Homestay 23', 'property', '/img/rooms/23.webp', 1),
(24, 'Penginapan Kasilapa Bay 24', 'Kasilapa Bay Homestay 24', 'property', '/img/rooms/24.webp', 1),
(25, 'Penginapan Kasilapa Bay 25', 'Kasilapa Bay Homestay 25', 'property', '/img/rooms/25.webp', 1),
(26, 'Penginapan Kasilapa Bay 26', 'Kasilapa Bay Homestay 26', 'property', '/img/rooms/26.webp', 1),
(27, 'Penginapan Kasilapa Bay 27', 'Kasilapa Bay Homestay 27', 'property', '/img/rooms/27.webp', 1),
(28, 'Penginapan Kasilapa Bay 28', 'Kasilapa Bay Homestay 28', 'property', '/img/rooms/28.webp', 1),
(29, 'Penginapan Kasilapa Bay 29', 'Kasilapa Bay Homestay 29', 'property', '/img/rooms/29.webp', 1),
(30, 'Penginapan Kasilapa Bay 30', 'Kasilapa Bay Homestay 30', 'property', '/img/rooms/30.webp', 1),
(31, 'Penginapan Kasilapa Bay 31', 'Kasilapa Bay Homestay 31', 'property', '/img/rooms/31.webp', 1),
(32, 'Penginapan Kasilapa Bay 32', 'Kasilapa Bay Homestay 32', 'property', '/img/rooms/32.webp', 1),
(33, 'Penginapan Kasilapa Bay 33', 'Kasilapa Bay Homestay 33', 'property', '/img/rooms/33.webp', 1),
(34, 'Penginapan Kasilapa Bay 34', 'Kasilapa Bay Homestay 34', 'property', '/img/rooms/34.webp', 1),
(35, 'Pantai Hondue', 'Hondue Beach', 'island', '/img/destinations/hondue.webp', 1),
(36, 'Puncak Kahianga', 'Kahianga Peak', 'island', '/img/destinations/kahianga.webp', 1),
(37, 'Spot Diving Roma', 'Roma Dive Site', 'underwater', '/img/destinations/roma.webp', 1),
(38, 'Benteng Nata', 'Nata Fortress', 'island', '/img/destinations/nata.webp', 1),
(39, 'Pantai Huntete', 'Huntete Beach', 'island', '/img/destinations/huntete.webp', 1),
(40, 'Benteng Patua', 'Patua Fortress', 'island', '/img/destinations/patua.webp', 1);

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
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `about_headline_id` TEXT,
  `about_description_id` TEXT,
  `about_headline_en` TEXT,
  `about_description_en` TEXT,
  `whatsapp_number` VARCHAR(30) NOT NULL DEFAULT '6282112345678',
  `email` VARCHAR(100) NOT NULL DEFAULT 'hello@kasilapabay.com',
  `address` TEXT,
  `instagram_url` VARCHAR(255) DEFAULT '',
  `facebook_url` VARCHAR(255) DEFAULT '',
  `tiktok_url` VARCHAR(255) DEFAULT '',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `site_settings` (`id`, `about_headline_id`, `about_description_id`, `about_headline_en`, `about_description_en`, `whatsapp_number`, `email`, `address`, `instagram_url`, `facebook_url`, `tiktok_url`) VALUES
(1, 
 'Kenyamanan Terbaik di Pulau Tomia', 
 'Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat, pelayanan ramah, dan harga yang bersahabat. Baik Anda seorang backpacker, turis, wisatawan, maupun keluarga yang berlibur bersama, Kasilapa Bay menghadirkan suasana hangat serasa di rumah sendiri.',
 'Best Comfort in Tomia Island',
 'Kasilapa Bay is a preferred accommodation in Wakatobi blending comfort, friendly hospitality, and affordable pricing. Whether you are a solo backpacker, adventurer, or traveling family, Kasilapa Bay offers a warm atmosphere feeling just like home.',
 '6282112345678',
 'hello@kasilapabay.com',
 'Desa Kasilapa, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia',
 'https://instagram.com/kasilapabay',
 'https://facebook.com/kasilapabay',
 'https://tiktok.com/@kasilapabay'
);
