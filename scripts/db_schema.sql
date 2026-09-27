-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kasilapa_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin','admin@kasilapahotel.com','$2y$10$7Jd1w8nXB09VYEH/rqQDHuOOVSbcNtH8bdjTIHBDSz7iXIxU2NxQ2','231d4aa3e22feb6c50a29796cbcb292aab927f04f047c4ccdf93429600cacde0','2026-09-25 19:06:23');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL DEFAULT 1,
  `phone_primary` varchar(30) NOT NULL DEFAULT '6282112345678',
  `phone_secondary` varchar(30) DEFAULT '6281234567890',
  `email` varchar(100) NOT NULL DEFAULT 'hello@kasilapahotel.com',
  `address` text DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT 'https://instagram.com/kasilapahoteltomia',
  `instagram_username` varchar(100) NOT NULL DEFAULT '@kasilapahoteltomia',
  `instagram_active` tinyint(1) NOT NULL DEFAULT 1,
  `facebook_url` varchar(255) DEFAULT '',
  `facebook_active` tinyint(1) NOT NULL DEFAULT 0,
  `tiktok_url` varchar(255) DEFAULT '',
  `tiktok_active` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'6282191957788','6285395546773','kasilapahotel@gmail.com','Patipelong, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia','https://instagram.com/kasilapahoteltomia','@kasilapahoteltomia',1,'',0,'',0,'2026-09-25 19:27:53');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destination_images`
--

DROP TABLE IF EXISTS `destination_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destination_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `destination_id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `is_cover` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `destination_id` (`destination_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `destination_images_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `destination_images_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destination_images`
--

LOCK TABLES `destination_images` WRITE;
/*!40000 ALTER TABLE `destination_images` DISABLE KEYS */;
INSERT INTO `destination_images` VALUES (1,1,4,1,0),(2,2,5,1,0),(3,3,6,1,0),(4,4,7,1,0),(5,5,8,1,0),(6,6,9,1,0),(8,8,11,1,0),(9,9,12,1,0),(10,10,13,1,0),(12,7,14,1,0);
/*!40000 ALTER TABLE `destination_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destinations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_id` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Alam',
  `description_id` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `distance` varchar(50) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `info_url` varchar(255) DEFAULT '',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (1,'Puncak Kahianga','Kahianga Peak','Pemandangan Alam','Titik tertinggi di Tomia dengan pemandangan laut biru tak berujung, bukit sabana yang hijau, dan sunset yang indah.','The highest point in Tomia with endless blue ocean views, green savanna hills, and beautiful sunsets.','10 menit berkendara','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg','https://www.wakatobitourism.com/item/kahianga-peak/','2026-09-25 19:06:23'),(2,'Desa Kulati','Kulati Village','Sejarah & Budaya','Desa wisata berbasis masyarakat dengan keindahan pantai tebing karang seperti Pantai Huntete yang eksotis.','A community-based tourism village with exotic coral cliff beaches such as Huntete Beach.','20 menit berkendara','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg','https://www.wakatobitourism.com/item/kulati-village/','2026-09-25 19:06:23'),(3,'Pulau Lentea','Lintea Island','Pantai','Pulau tetangga berpasir putih halus yang dikelilingi pohon kelapa menjulang tinggi dan air laut yang sangat jernih.','A neighboring island with fine white sand surrounded by tall coconut trees and crystal-clear water.','30 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Pulau-Lentea-Tomia-49-428x242.jpg','https://www.wakatobitourism.com/item/lintea-island/','2026-09-25 19:06:23'),(4,'Roma','Roma Dive Site','Diving','Spot menyelam paling populer dengan ribuan schooling fish yang mengitari puncak terumbu karang melingkar besar.','The most popular dive spot featuring thousands of schooling fish circling a large coral pinnacle.','15 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg','https://www.wakatobitourism.com/item/roma/','2026-09-25 19:06:23'),(5,'Pulau Nda\'a','Nda\'a Island','Pantai','Pulau tak berpenghuni dengan pantai berpasir selembut tepung dan ekosistem terumbu karang yang sangat dangkal dan utuh.','An uninhabited island with powdery white sand beaches and intact shallow coral reef ecosystems.','40 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Ndaa-Island-by-Guntur-2-428x242.jpg','https://www.wakatobitourism.com/item/ndaa-island/','2026-09-25 19:06:23'),(6,'Benteng Patua','Patua Fort','Sejarah & Budaya','Benteng bersejarah peninggalan Kesultanan Buton di puncak bukit batu karang Tomia yang menyuguhkan lanskap spektakuler.','A historic fort from the Buton Sultanate on Tomia\'s coral hill offering spectacular landscapes.','18 menit berkendara','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Patua-Fort-by-Amal-Hermawan-428x242.jpg','https://www.wakatobitourism.com/item/patua-fort/','2026-09-25 19:06:23'),(7,'Ali Reef','Ali Reef','Diving','Spot menyelam populer yang terkenal dengan kawanan besar ikan schooling fish yang berenang bebas di antara terumbu karang.','Popular dive spot known for large schools of fish swimming freely among vibrant corals.','20 menit perahu','/img/uploads/upload_scraped_1790364029_b62605053fd5.webp','https://www.wakatobitourism.com/item/ali-reef/','2026-09-25 19:06:23'),(8,'Kolosuha','Kolosuha','Diving','Tebing terumbu karang bawah laut yang curam di sisi barat Tomia, dipenuhi keanekaragaman biota laut.','A steep underwater coral reef wall on Tomia\'s west side filled with diverse marine life.','18 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Kolosuha-by-Wakatobi-Regency-428x242.jpg','https://www.wakatobitourism.com/item/kolosuha/','2026-09-25 19:06:23'),(9,'Mari Mabuk','Mari Mabuk','Diving','Salah satu titik selam favorit dengan pemandangan terumbu karang warna-warni dan arus air yang bersahabat.','A favorite dive spot featuring colorful coral reef views and gentle water currents.','15 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/05/Mari-Mabuk-by-Hendra-Tan-min-1-428x242.jpg','https://www.wakatobitourism.com/item/mari-mabuk/','2026-09-25 19:06:23'),(10,'Wreck of Kulati','Wreck of Kulati','Diving','Bangkai kapal karam bersejarah di kedalaman laut dekat Kulati yang kini bertransformasi menjadi rumah bagi terumbu karang indah.','A historic shipwreck in deep waters near Kulati now transformed into a home for vibrant corals.','25 menit perahu','https://www.wakatobitourism.com/wp-content/uploads/2018/04/Wreck-Kulati-by-Guntur-428x242.jpg','https://www.wakatobitourism.com/item/wreck-of-kulati/','2026-09-25 19:06:23');
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_id` varchar(100) NOT NULL,
  `title_en` varchar(100) NOT NULL,
  `icon_name` varchar(50) NOT NULL DEFAULT 'wifi',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'WiFi Gratis','Free WiFi','wifi',1,'2026-09-25 19:06:23'),(2,'Sarapan Lokal','Local Breakfast','breakfast',1,'2026-09-25 19:06:23'),(3,'Sewa Mobil','Car Rental','car',1,'2026-09-25 19:06:23'),(4,'Sewa Motor','Bike Rental','bike',1,'2026-09-25 19:06:23'),(5,'Parkir','Parking','parking',1,'2026-09-25 19:06:23'),(6,'Laundry','Laundry','laundry',1,'2026-09-25 19:06:23'),(7,'Listrik 24 Jam','24h Electricity','electricity',1,'2026-09-25 19:06:23'),(8,'Air Bersih','Fresh Water','water',1,'2026-09-25 19:06:23');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `alt_text_id` varchar(255) DEFAULT NULL,
  `alt_text_en` varchar(255) DEFAULT NULL,
  `source` enum('upload','external','seed') NOT NULL DEFAULT 'seed',
  `category` varchar(50) DEFAULT 'property',
  `is_active` tinyint(1) DEFAULT 1,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,NULL,'/img/room.webp','/img/room.webp','Standart Room','Standard Room','seed','property',1,'2026-09-25 19:06:23'),(2,NULL,'/img/hero.webp','/img/hero.webp','Deluxe Room','Deluxe Room','seed','property',1,'2026-09-25 19:06:23'),(4,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg',NULL,'Puncak Kahianga','Kahianga Peak','external','island',1,'2026-09-25 19:06:23'),(5,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg',NULL,'Desa Kulati','Kulati Village','external','island',1,'2026-09-25 19:06:23'),(6,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Pulau-Lentea-Tomia-49-428x242.jpg',NULL,'Pulau Lentea','Lintea Island','external','island',1,'2026-09-25 19:06:23'),(7,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg',NULL,'Roma','Roma Dive Site','external','island',1,'2026-09-25 19:06:23'),(8,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Ndaa-Island-by-Guntur-2-428x242.jpg',NULL,'Pulau Nda\'a','Nda\'a Island','external','island',1,'2026-09-25 19:06:23'),(9,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Patua-Fort-by-Amal-Hermawan-428x242.jpg',NULL,'Benteng Patua','Patua Fort','external','island',1,'2026-09-25 19:06:23'),(11,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Kolosuha-by-Wakatobi-Regency-428x242.jpg',NULL,'Kolosuha','Kolosuha','external','island',1,'2026-09-25 19:06:23'),(12,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/05/Mari-Mabuk-by-Hendra-Tan-min-1-428x242.jpg',NULL,'Mari Mabuk','Mari Mabuk','external','island',1,'2026-09-25 19:06:23'),(13,NULL,'https://www.wakatobitourism.com/wp-content/uploads/2018/04/Wreck-Kulati-by-Guntur-428x242.jpg',NULL,'Wreck of Kulati','Wreck of Kulati','external','island',1,'2026-09-25 19:06:23'),(14,'Fish-Schooling-by-DCDC-min.jpg','/img/uploads/upload_scraped_1790364029_b62605053fd5.webp','/img/uploads/upload_scraped_1790364029_b62605053fd5_thumb.webp','Ali Reef ??','Ali Reef ??','upload','underwater',1,'2026-09-25 19:20:29'),(15,'DSCF3015.jpg','/img/uploads/upload_1790364125_f51a70858b97.webp','/img/uploads/upload_1790364125_f51a70858b97_thumb.webp','DSCF3015','DSCF3015','upload','property',1,'2026-09-25 19:22:06'),(16,'DSCF3019.jpg','/img/uploads/upload_1790364128_50625c8052f6.webp','/img/uploads/upload_1790364128_50625c8052f6_thumb.webp','DSCF3019','DSCF3019','upload','property',1,'2026-09-25 19:22:09'),(17,'DSCF3021.jpg','/img/uploads/upload_1790364131_2ccb1af10a32.webp','/img/uploads/upload_1790364131_2ccb1af10a32_thumb.webp','DSCF3021','DSCF3021','upload','property',1,'2026-09-25 19:22:12'),(18,'DSCF3023.jpg','/img/uploads/upload_1790364135_0eb7e4826dcf.webp','/img/uploads/upload_1790364135_0eb7e4826dcf_thumb.webp','DSCF3023','DSCF3023','upload','property',1,'2026-09-25 19:22:16'),(19,'DSCF3024.jpg','/img/uploads/upload_1790364138_465a4aab0e8a.webp','/img/uploads/upload_1790364138_465a4aab0e8a_thumb.webp','DSCF3024','DSCF3024','upload','property',1,'2026-09-25 19:22:19'),(20,'DSCF3048.jpg','/img/uploads/upload_1790364141_8b83fc22bbad.webp','/img/uploads/upload_1790364141_8b83fc22bbad_thumb.webp','DSCF3048','DSCF3048','upload','property',1,'2026-09-25 19:22:22'),(21,'DSCF3058.jpg','/img/uploads/upload_1790364145_db402cc5de28.webp','/img/uploads/upload_1790364145_db402cc5de28_thumb.webp','DSCF3058','DSCF3058','upload','property',1,'2026-09-25 19:22:26'),(22,'DSCF3060.jpg','/img/uploads/upload_1790364149_9d5381cdbbca.webp','/img/uploads/upload_1790364149_9d5381cdbbca_thumb.webp','DSCF3060','DSCF3060','upload','property',1,'2026-09-25 19:22:30'),(23,'DSCF3063.jpg','/img/uploads/upload_1790364153_249d79fa990d.webp','/img/uploads/upload_1790364153_249d79fa990d_thumb.webp','DSCF3063','DSCF3063','upload','property',1,'2026-09-25 19:22:34'),(24,'DSCF3065.jpg','/img/uploads/upload_1790364157_04df186f89f5.webp','/img/uploads/upload_1790364157_04df186f89f5_thumb.webp','DSCF3065','DSCF3065','upload','property',1,'2026-09-25 19:22:38'),(25,'DSCF3067.jpg','/img/uploads/upload_1790364161_8438205ffc4a.webp','/img/uploads/upload_1790364161_8438205ffc4a_thumb.webp','DSCF3067','DSCF3067','upload','property',1,'2026-09-25 19:22:42'),(26,'DSCF3090.jpg','/img/uploads/upload_1790364165_4dd2d683070b.webp','/img/uploads/upload_1790364165_4dd2d683070b_thumb.webp','DSCF3090','DSCF3090','upload','property',1,'2026-09-25 19:22:46'),(27,'DSCF3092.jpg','/img/uploads/upload_1790364169_fa840608cedd.webp','/img/uploads/upload_1790364169_fa840608cedd_thumb.webp','DSCF3092','DSCF3092','upload','property',1,'2026-09-25 19:22:50'),(28,'DSCF3095.jpg','/img/uploads/upload_1790364172_6b182aade893.webp','/img/uploads/upload_1790364172_6b182aade893_thumb.webp','DSCF3095','DSCF3095','upload','property',1,'2026-09-25 19:22:53'),(29,'DSCF3108.jpg','/img/uploads/upload_1790364176_5555cf368d9c.webp','/img/uploads/upload_1790364176_5555cf368d9c_thumb.webp','DSCF3108','DSCF3108','upload','property',1,'2026-09-25 19:22:57'),(30,'DSCF3110.jpg','/img/uploads/upload_1790364180_8010fd0aed84.webp','/img/uploads/upload_1790364180_8010fd0aed84_thumb.webp','DSCF3110','DSCF3110','upload','property',1,'2026-09-25 19:23:01'),(31,'DSCF3111.jpg','/img/uploads/upload_1790364183_dd9b6273da08.webp','/img/uploads/upload_1790364183_dd9b6273da08_thumb.webp','DSCF3111','DSCF3111','upload','property',1,'2026-09-25 19:23:04'),(32,'DSCF3117.jpg','/img/uploads/upload_1790364186_dbe5a38c6cdb.webp','/img/uploads/upload_1790364186_dbe5a38c6cdb_thumb.webp','DSCF3117','DSCF3117','upload','property',1,'2026-09-25 19:23:07'),(33,'DSCF3132.jpg','/img/uploads/upload_1790364189_9bfad55069d2.webp','/img/uploads/upload_1790364189_9bfad55069d2_thumb.webp','DSCF3132','DSCF3132','upload','property',1,'2026-09-25 19:23:10'),(34,'DSCF3135.jpg','/img/uploads/upload_1790364193_98e6aae6a741.webp','/img/uploads/upload_1790364193_98e6aae6a741_thumb.webp','DSCF3135','DSCF3135','upload','property',1,'2026-09-25 19:23:14'),(35,'DSCF3137.jpg','/img/uploads/upload_1790364196_53ec035b3f79.webp','/img/uploads/upload_1790364196_53ec035b3f79_thumb.webp','DSCF3137','DSCF3137','upload','property',1,'2026-09-25 19:23:17'),(37,'DSCF3146.jpg','/img/uploads/upload_1790364203_1d4cdcac9f47.webp','/img/uploads/upload_1790364203_1d4cdcac9f47_thumb.webp','DSCF3146','DSCF3146','upload','property',1,'2026-09-25 19:23:24'),(38,'DSCF3154.jpg','/img/uploads/upload_1790364207_ace2c1d79fb6.webp','/img/uploads/upload_1790364207_ace2c1d79fb6_thumb.webp','DSCF3154','DSCF3154','upload','property',1,'2026-09-25 19:23:28'),(39,'IMG_3245.JPG','/img/uploads/upload_1790364209_9ad5106f476e.webp','/img/uploads/upload_1790364209_9ad5106f476e_thumb.webp','IMG_3245','IMG_3245','upload','property',1,'2026-09-25 19:23:30'),(40,'IMG_3246.JPG','/img/uploads/upload_1790364212_e0c2ff822489.webp','/img/uploads/upload_1790364212_e0c2ff822489_thumb.webp','IMG_3246','IMG_3246','upload','property',1,'2026-09-25 19:23:32'),(41,'IMG_3248.JPG','/img/uploads/upload_1790364214_9294cf8f1dae.webp','/img/uploads/upload_1790364214_9294cf8f1dae_thumb.webp','IMG_3248','IMG_3248','upload','property',1,'2026-09-25 19:23:35'),(42,'IMG_3269.JPG','/img/uploads/upload_1790364217_7518b43ef421.webp','/img/uploads/upload_1790364217_7518b43ef421_thumb.webp','IMG_3269','IMG_3269','upload','property',1,'2026-09-25 19:23:37'),(43,'IMG_3270.JPG','/img/uploads/upload_1790364219_53dc5335ee1e.webp','/img/uploads/upload_1790364219_53dc5335ee1e_thumb.webp','IMG_3270','IMG_3270','upload','property',1,'2026-09-25 19:23:40'),(44,'IMG_3271.JPG','/img/uploads/upload_1790364221_9e1694ce8842.webp','/img/uploads/upload_1790364221_9e1694ce8842_thumb.webp','IMG_3271','IMG_3271','upload','property',1,'2026-09-25 19:23:42');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guest_name` varchar(100) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment_id` text NOT NULL,
  `comment_en` text NOT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Putri Kitnas','Depok, Indonesia',5,'Rasanya seperti di rumah. Ibu dan Bapak Haji menjadikan kami seperti mengunjungi keluarga daripada menginap di hotel. Saya memiliki harapan yang rendah sebelum datang, namun tempat ini sangat cocok dalam hal kebersihan, kenyamanan, lokasi, dan makanan.','Feels just like home. Ibu and Bapak Haji treated us like visiting family rather than hotel guests. Very clean, comfortable, great location and delicious food.',1,'2026-09-25 19:06:23'),(2,'Lelie Liana','Bali, Indonesia',5,'Hotelnya nyaman. Kamarnya luas. Lokasi hotelnya juga di tempat yang sepi dan tidak ramai jalur kendaraan. Kamar di ujung sangat luas dan menghadap laut. Udara dan angin banyak. Saya sangat suka. Masakan Ibu pemilik hotel sangat enak.','Comfortable hotel with spacious rooms in a peaceful location away from busy traffic. The corner room faces the sea with great fresh ocean breezes. Delicious homemade meals.',1,'2026-09-25 19:06:23'),(3,'famokossatour','Indonesia',5,'Jika anda sedang merencanakan untuk berlibur di Pulau Tomia, Kasilapa Bay Hotel menjadi rekomendasi utama untuk akomodasi selama berada di sana. Selain kenyamanan serta keramahan pelayanan, Kasilapa Bay Hotel juga menawarkan pemandangan yang indah tepat di teluk Kasilapa.','If you are planning a trip to Tomia Island, Kasilapa Bay Hotel is the top recommendation for accommodation. Great hospitality, clean environment, and beautiful scenery right on Kasilapa bay.',1,'2026-09-25 19:06:23'),(4,'Anne Mbouw','Indonesia',5,'Langsung dijemput dari pelabuhan, kamar bersih & nyaman, serta suasana sore di halaman belakang sungguh indah. Penginapan ini seperti rumah sendiri, dengan teras santai dan tuan rumah yang sangat ramah.','Picked up directly from the harbor, clean & cozy rooms, and lovely afternoon atmosphere in the backyard. Host family is super warm and friendly.',1,'2026-09-25 19:06:23');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `is_cover` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `room_images_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,1,1,0),(4,2,16,1,0);
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_id` varchar(100) NOT NULL,
  `title_en` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `price_per_night` decimal(12,2) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 2,
  `bed_type` varchar(50) NOT NULL DEFAULT 'King Bed',
  `image_url` varchar(255) NOT NULL,
  `description_id` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Standart Room','Standard Room','standart-room',250000.00,2,'Double Bed','/img/room.webp','Tipe kamar ini merupakan opsi paling ekonomis, biasanya ditujukan untuk solo traveler atau dua orang yang menginginkan akomodasi standar.','The most economical option, perfect for solo travelers or couples looking for standard accommodation.',0,'2026-09-25 19:06:23'),(2,'Deluxe Room','Deluxe Room','deluxe-room',280000.00,2,'King Bed','/img/uploads/upload_1790364128_50625c8052f6.webp','Tipe kamar dengan ukuran ruang yang lebih lapang dan penataan yang lebih nyaman untuk istirahat maksimal selama berada di Pulau Tomia.','Spacious room with a comfortable layout designed for maximum relaxation during your stay on Tomia Island.',1,'2026-09-25 19:06:23');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `about_headline_id` text DEFAULT NULL,
  `about_description_id` text DEFAULT NULL,
  `about_headline_en` text DEFAULT NULL,
  `about_description_en` text DEFAULT NULL,
  `about_images` text DEFAULT NULL,
  `room_layout_single` varchar(50) DEFAULT 'split',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'Kenyamanan Terbaik di Pulau Tomia','Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat, pelayanan ramah, dan harga yang bersahabat. Baik Anda seorang backpacker, turis, wisatawan, maupun keluarga yang berlibur bersama, Kasilapa Bay menghadirkan suasana hangat serasa di rumah sendiri.','Best Comfort in Tomia Island','Kasilapa Bay is a preferred accommodation in Wakatobi blending comfort, friendly hospitality, and affordable pricing. Whether you are a solo backpacker, adventurer, or traveling family, Kasilapa Bay offers a warm atmosphere feeling just like home.','[\"\\/img\\/uploads\\/upload_1790364203_1d4cdcac9f47.webp\",\"\\/img\\/uploads\\/upload_1790364165_4dd2d683070b.webp\",\"\\/img\\/uploads\\/upload_1790364186_dbe5a38c6cdb.webp\",\"\\/img\\/uploads\\/upload_1790364176_5555cf368d9c.webp\",\"\\/img\\/uploads\\/upload_1790364157_04df186f89f5.webp\",\"\\/img\\/uploads\\/upload_1790364193_98e6aae6a741.webp\"]','grid','2026-09-27 04:59:01');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_visitors`
--

DROP TABLE IF EXISTS `site_visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_visitors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(64) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `page_url` varchar(255) NOT NULL,
  `page_title` varchar(255) DEFAULT '',
  `referrer` varchar(255) DEFAULT '',
  `device_type` varchar(20) DEFAULT 'desktop',
  `browser` varchar(50) DEFAULT 'Chrome',
  `operating_system` varchar(50) DEFAULT 'Windows',
  `country_code` varchar(10) DEFAULT 'ID',
  `country_name` varchar(100) DEFAULT 'Indonesia',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_page_url` (`page_url`),
  KEY `idx_session` (`session_id`),
  KEY `idx_date_ip` (`created_at`,`ip_address`),
  KEY `idx_country` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_visitors`
--

LOCK TABLES `site_visitors` WRITE;
/*!40000 ALTER TABLE `site_visitors` DISABLE KEYS */;
INSERT INTO `site_visitors` VALUES (1,'sess_vl3eclhy4_muhcfya6','2001:448a:****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-25 19:18:28'),(2,'sess_n4g30ms94_muhcnagh','2001:448a:****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-25 19:24:10'),(3,'sess_3sw9ubhud_muhcribp','2001:448a:****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-25 19:27:27'),(4,'sess_rboj8j53u_muh61f6y','::****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','http://localhost:3000/id','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-25 19:47:22'),(5,'sess_flhr13flx_mujb1aak','::****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','http://localhost:3000/','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-27 04:57:08'),(6,'sess_flhr13flx_mujb1aak','::****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','http://localhost:3000/','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-27 04:57:12'),(7,'sess_flhr13flx_mujb1aak','::****:****','/id','Kasilapa Bay — Situs Resmi Penginapan di Tomia, Wakatobi','http://localhost:3000/id','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-27 04:57:56'),(8,'sess_flhr13flx_mujb1aak','::****:****','/en','Kasilapa Bay — Official Site | Beachfront Homestay in Tomia, Wakatobi','http://localhost:3000/id','desktop','Chrome','Windows 10/11','ID','Indonesia','2026-09-27 04:58:52');
/*!40000 ALTER TABLE `site_visitors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-27 14:06:16
