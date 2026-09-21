-- ==============================================================================
-- Kasilapa Bay - Migration: Add active status columns for social media
-- Allows toggling each social media link on/off independently
-- ==============================================================================

ALTER TABLE `contacts`
  ADD COLUMN IF NOT EXISTS `instagram_active` TINYINT(1) NOT NULL DEFAULT 1 AFTER `instagram_url`,
  ADD COLUMN IF NOT EXISTS `facebook_active` TINYINT(1) NOT NULL DEFAULT 0 AFTER `facebook_url`,
  ADD COLUMN IF NOT EXISTS `tiktok_active` TINYINT(1) NOT NULL DEFAULT 0 AFTER `tiktok_url`;
