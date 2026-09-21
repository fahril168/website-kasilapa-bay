-- ==============================================================================
-- Kasilapa Bay - Migrasi Media Library Terpusat
-- Tabel: images, room_images, destination_images
-- Dapat dijalankan di phpMyAdmin Hostinger maupun MySQL Localhost
-- ==============================================================================

-- 1. Skema Tabel Baru
CREATE TABLE IF NOT EXISTS `images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `alt_text_id` VARCHAR(255) DEFAULT NULL,
  `alt_text_en` VARCHAR(255) DEFAULT NULL,
  `source` ENUM('upload', 'external', 'seed') NOT NULL DEFAULT 'seed',
  `category` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `room_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT NOT NULL,
  `image_id` INT NOT NULL,
  `is_cover` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `destination_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `destination_id` INT NOT NULL,
  `image_id` INT NOT NULL,
  `is_cover` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Migrasi Data Existing
-- STEP 1: Masukkan semua gambar unik dari rooms ke tabel images
INSERT INTO `images` (`url`, `source`, `category`, `is_active`)
SELECT DISTINCT `image_url`, 'seed', 'property', 1
FROM `rooms`
WHERE `image_url` NOT IN (SELECT `url` FROM `images`);

-- STEP 2: Masukkan semua gambar unik dari destinations ke tabel images
INSERT INTO `images` (`url`, `source`, `category`, `is_active`)
SELECT DISTINCT `image_url`,
  CASE WHEN `image_url` LIKE 'http%' THEN 'external' ELSE 'seed' END,
  'island',
  1
FROM `destinations`
WHERE `image_url` NOT IN (SELECT `url` FROM `images`);

-- STEP 3: Masukkan sisa gambar dari gallery yang belum ada di images
INSERT INTO `images` (`url`, `source`, `category`, `is_active`)
SELECT DISTINCT g.`image_url`,
  CASE WHEN g.`image_url` LIKE 'http%' THEN 'external' ELSE 'seed' END,
  g.`category`,
  1
FROM `gallery` g
WHERE g.`image_url` NOT IN (SELECT `url` FROM `images`);

-- STEP 4: Hubungkan setiap rooms.image_url ke images.id, tandai sebagai cover
INSERT INTO `room_images` (`room_id`, `image_id`, `is_cover`, `sort_order`)
SELECT r.`id`, i.`id`, 1, 0
FROM `rooms` r
JOIN `images` i ON i.`url` = r.`image_url`
WHERE NOT EXISTS (
  SELECT 1 FROM `room_images` ri WHERE ri.`room_id` = r.`id` AND ri.`image_id` = i.`id`
);

-- STEP 5: Hubungkan setiap destinations.image_url ke images.id, tandai sebagai cover
INSERT INTO `destination_images` (`destination_id`, `image_id`, `is_cover`, `sort_order`)
SELECT d.`id`, i.`id`, 1, 0
FROM `destinations` d
JOIN `images` i ON i.`url` = d.`image_url`
WHERE NOT EXISTS (
  SELECT 1 FROM `destination_images` di WHERE di.`destination_id` = d.`id` AND di.`image_id` = i.`id`
);
