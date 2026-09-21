-- ==============================================================================
-- Kasilapa Bay - Tahap 7: Pensiunkan & Hapus Tabel Gallery Lama
-- Eksekusi file ini di phpMyAdmin Hostinger setelah seluruh migrasi terbukti stabil
-- ==============================================================================

-- 1. Verifikasi terlebih dahulu bahwa tabel images dan junction sudah memiliki data:
-- SELECT COUNT(*) AS total_images FROM `images`;
-- SELECT COUNT(*) AS total_room_images FROM `room_images`;
-- SELECT COUNT(*) AS total_destination_images FROM `destination_images`;

-- 2. Hapus tabel gallery lama (karena semua endpoint galeri & media library kini membaca dari tabel `images`):
DROP TABLE IF EXISTS `gallery`;

-- Selesai! Arsitektur database Anda sekarang 100% menggunakan Media Library terpusat.
