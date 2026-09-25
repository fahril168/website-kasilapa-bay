-- ==============================================================================
-- Migration: Add is_active column to rooms table & room_layout_single to site_settings
-- Safe to execute multiple times or on production database (Hostinger phpMyAdmin)
-- ==============================================================================

-- 1. Tambah kolom is_active pada tabel rooms jika belum ada
ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `is_active` TINYINT(1) DEFAULT 1 AFTER `description_en`;

-- Fallback jika versi MySQL Anda belum mendukung IF NOT EXISTS pada ADD COLUMN:
-- ALTER TABLE `rooms` ADD COLUMN `is_active` TINYINT(1) DEFAULT 1;

-- Pastikan data kamar yang ada saat ini berstatus aktif (1)
UPDATE `rooms` SET `is_active` = 1 WHERE `is_active` IS NULL;

-- 2. Tambah kolom room_layout_single pada tabel site_settings jika belum ada
ALTER TABLE `site_settings` ADD COLUMN IF NOT EXISTS `room_layout_single` VARCHAR(50) DEFAULT 'split' AFTER `about_images`;

-- Pastikan nilai default terisi
UPDATE `site_settings` SET `room_layout_single` = 'split' WHERE `room_layout_single` IS NULL OR `room_layout_single` = '';
