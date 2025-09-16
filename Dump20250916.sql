CREATE DATABASE  IF NOT EXISTS `rating_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rating_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: rating_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating_value` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_store_rating` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,3,1,4,'2025-09-14 16:01:45','2025-09-15 17:08:46'),(7,3,2,2,'2025-09-15 17:08:41','2025-09-15 17:08:41'),(14,3,6,5,'2025-09-15 17:14:19','2025-09-16 05:21:34'),(27,4,6,2,'2025-09-15 17:17:07','2025-09-15 17:17:15'),(30,4,1,3,'2025-09-15 17:17:18','2025-09-15 17:17:18'),(31,4,2,3,'2025-09-15 17:17:21','2025-09-15 17:17:21'),(33,3,7,4,'2025-09-16 05:21:39','2025-09-16 05:21:39');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` text,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'vaibhav dukandar','vaibhavdukan@gmail.com','dddd',4,'2025-09-14 15:57:17'),(2,'shahid ','shahid@gmail.com','jnfjnfj',2,'2025-09-14 16:40:27'),(6,'shahid1','shahid1@gmail.com','ccc',4,'2025-09-15 16:12:39'),(7,'sjbsb','scs@gmail.com','jscjbsjb',7,'2025-09-16 05:17:05');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text,
  `role` enum('System Administrator','Normal User','Store Owner') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'vaibhav','vaibhav@gmail.com','$2b$10$7XTWfkILCHxB56S1zjbgL.MJfwUh9LLxLTnB13jENTUGCcjLFalDq','bwujdbwjdb','Normal User','2025-09-12 10:15:29'),(2,'shahid','shahid@gmail.com','$2b$10$FjcOJeYUI68VvSrHpSuJ6untxEaAHF5Q3dSS6te8ym53qtWwtJLBy','jsbdjnsdj','System Administrator','2025-09-12 10:23:59'),(3,'vaibhav1234567891011121314','vaibhav123@gmail.com','$2b$10$E2o/DIUgf9cdZCc7XMKIhuy2Dc3OkU5Vvgt7vHRWkc/ImyFpXUM6u','hhhhhh','Normal User','2025-09-14 12:48:59'),(4,'owner Vaibhav Manjare','owner@gmail.com','$2b$10$5bTfncszb52ZiMA1r/QHQOLkxpCK3g3/443Z4Bf2jjJEJacncLR9C','jhjhjhjhjhjh','Store Owner','2025-09-14 13:11:45'),(5,'vaibhav1234567891011121314','vaibhav1@gmail.com','$2b$10$gbngahf4h6k9BaH2SXit0upR3zBP19BO58VRokkbV4DO3ojuNlX3O','dd','Normal User','2025-09-14 16:45:05'),(6,'aditya','adi@gmail.com','$2b$10$o0byPDaQXfbM5BNrpog/.OywkoGCFbcGhHPvN.jzjcRRR1SEVufEK','sndsjd','Store Owner','2025-09-15 16:56:15'),(7,'abc','abc@gmail.com','$2b$10$ihBfdHcK0HBospos9JXtsuGHgG8Vn2d/eaDyt2v1FnWU.w1.CyqNe','dvdfd','Store Owner','2025-09-16 05:17:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-16 11:20:25
