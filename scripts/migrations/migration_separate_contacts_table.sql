-- ==============================================================================
-- Kasilapa Bay - Database Migration: Separate Contacts Table
-- Splits contact & social media info out of site_settings into dedicated `contacts` table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `phone_primary` VARCHAR(30) NOT NULL DEFAULT '6282112345678',
  `phone_secondary` VARCHAR(30) DEFAULT '6281234567890',
  `email` VARCHAR(100) NOT NULL DEFAULT 'hello@kasilapabay.com',
  `address` TEXT,
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/kasilapabay',
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com/kasilapabay',
  `tiktok_url` VARCHAR(255) DEFAULT 'https://tiktok.com/@kasilapabay',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migrate existing contact and social data from site_settings into contacts
INSERT INTO `contacts` (`id`, `phone_primary`, `phone_secondary`, `email`, `address`, `instagram_url`, `facebook_url`, `tiktok_url`)
SELECT 
  1, 
  COALESCE(NULLIF(whatsapp_number, ''), '6282112345678'), 
  COALESCE(NULLIF(whatsapp_number_secondary, ''), '6281234567890'), 
  COALESCE(NULLIF(email, ''), 'hello@kasilapabay.com'), 
  COALESCE(NULLIF(address, ''), 'Desa Kasilapa, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia'), 
  COALESCE(NULLIF(instagram_url, ''), 'https://instagram.com/kasilapabay'), 
  COALESCE(NULLIF(facebook_url, ''), 'https://facebook.com/kasilapabay'), 
  COALESCE(NULLIF(tiktok_url, ''), 'https://tiktok.com/@kasilapabay')
FROM `site_settings`
WHERE `id` = 1
ON DUPLICATE KEY UPDATE
  `phone_primary` = VALUES(`phone_primary`),
  `phone_secondary` = VALUES(`phone_secondary`),
  `email` = VALUES(`email`),
  `address` = VALUES(`address`),
  `instagram_url` = VALUES(`instagram_url`),
  `facebook_url` = VALUES(`facebook_url`),
  `tiktok_url` = VALUES(`tiktok_url`);

-- Clean up: Remove contact & social columns from site_settings
ALTER TABLE `site_settings`
  DROP COLUMN `whatsapp_number`,
  DROP COLUMN `whatsapp_number_secondary`,
  DROP COLUMN `email`,
  DROP COLUMN `address`,
  DROP COLUMN `instagram_url`,
  DROP COLUMN `facebook_url`,
  DROP COLUMN `tiktok_url`;

