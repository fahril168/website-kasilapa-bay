-- Migration: Add instagram_username to contacts table
-- Created at: 2026-09-21

ALTER TABLE `contacts`
  ADD COLUMN IF NOT EXISTS `instagram_username` VARCHAR(100) NOT NULL DEFAULT '@kasilapabay' AFTER `instagram_url`;
