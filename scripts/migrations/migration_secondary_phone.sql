-- Migration: Add secondary phone / WhatsApp number to site_settings table
ALTER TABLE `site_settings` ADD COLUMN `whatsapp_number_secondary` VARCHAR(30) DEFAULT '' AFTER `whatsapp_number`;
