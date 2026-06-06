-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: ems
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_year`
--

DROP TABLE IF EXISTS `academic_year`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_year` (
  `academic_id` int NOT NULL AUTO_INCREMENT,
  `academic_name` varchar(10) DEFAULT NULL,
  `is_admission` int DEFAULT '0',
  `current_ay` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`academic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendance_record`
--

DROP TABLE IF EXISTS `attendance_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_record` (
  `att_id` int NOT NULL AUTO_INCREMENT,
  `seating_id` int DEFAULT NULL,
  `is_present` tinyint(1) DEFAULT '0',
  `submitted_by` int DEFAULT NULL,
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`att_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_id` bigint NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `entity_type` varchar(100) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `before_json` json DEFAULT NULL,
  `after_json` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `block_allocation`
--

DROP TABLE IF EXISTS `block_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `block_allocation` (
  `block_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `timetable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `room_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `block_no` varchar(20) DEFAULT NULL,
  `allocated_capacity` int DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`block_id`),
  KEY `idx_block_timetable_id` (`timetable_id`) USING BTREE,
  KEY `idx_block_room_id` (`room_id`) USING BTREE,
  KEY `idx_block_timetable_room` (`timetable_id`,`room_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programm_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `depart_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `branch_name` varchar(200) NOT NULL,
  `branch_code` varchar(20) DEFAULT NULL,
  `total_intake` int DEFAULT NULL,
  `accreditation_status` varchar(100) DEFAULT NULL,
  `established_year` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`branch_id`),
  KEY `idx_branch_programm_id` (`programm_id`) USING BTREE,
  KEY `idx_branch_depart_id` (`depart_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `building`
--

DROP TABLE IF EXISTS `building`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `building` (
  `building_id` int NOT NULL AUTO_INCREMENT,
  `institution_id` int DEFAULT NULL,
  `building_name` varchar(200) NOT NULL,
  `total_floors` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category_master`
--

DROP TABLE IF EXISTS `category_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_master` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(100) NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `co_attainment`
--

DROP TABLE IF EXISTS `co_attainment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `co_attainment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `co_id` int DEFAULT NULL,
  `attainment_value` decimal(5,2) DEFAULT NULL,
  `computed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `co_po_mapping`
--

DROP TABLE IF EXISTS `co_po_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `co_po_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `co_id` int DEFAULT NULL,
  `po_id` int DEFAULT NULL,
  `correlation_level` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_co_po` (`co_id`,`po_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coe`
--

DROP TABLE IF EXISTS `coe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coe` (
  `coe_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `institution_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_id` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`coe_id`),
  UNIQUE KEY `idx_coe_email` (`email`) USING BTREE,
  KEY `idx_coe_institution` (`institution_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `copy_case`
--

DROP TABLE IF EXISTS `copy_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `copy_case` (
  `case_id` int NOT NULL AUTO_INCREMENT,
  `sid` int DEFAULT NULL,
  `timetable_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `seat_no` varchar(20) DEFAULT NULL,
  `incident_description` text,
  `evidence_url` varchar(500) DEFAULT NULL,
  `declaration_url` varchar(500) DEFAULT NULL,
  `supervisor_id` int DEFAULT NULL,
  `case_status` varchar(30) DEFAULT 'new',
  `coe_remark` text,
  `punishment_reason` text,
  `punishment_from` date DEFAULT NULL,
  `punishment_to` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`case_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `copy_case_log`
--

DROP TABLE IF EXISTS `copy_case_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `copy_case_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `case_id` int DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `actioned_by` int DEFAULT NULL,
  `remarks` text,
  `actioned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_outcome`
--

DROP TABLE IF EXISTS `course_outcome`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_outcome` (
  `co_id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int DEFAULT NULL,
  `co_code` varchar(20) DEFAULT NULL,
  `description` text,
  `blooms_level` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`co_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `depart_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `institution_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `depart_name` varchar(200) NOT NULL,
  `depart_code` varchar(20) DEFAULT NULL,
  `hod_faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`depart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_event`
--

DROP TABLE IF EXISTS `exam_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_event` (
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `institution_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `academic_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `event_name` varchar(255) NOT NULL,
  `exam_type` varchar(50) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `exam_time` date DEFAULT NULL,
  `fee_regular` decimal(10,2) DEFAULT '0.00',
  `fee_backlog` decimal(10,2) DEFAULT '0.00',
  `pattern_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `status` varchar(30) DEFAULT 'draft' COMMENT 'draft, published, closed, cancelled',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `reschedule_reason` text,
  `updated_dates` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `late_reg_allowed` tinyint(1) DEFAULT '0',
  `late_reg_deadline` date DEFAULT NULL,
  `late_reg_fee` decimal(10,2) DEFAULT '0.00',
  `late_reg_max_days` int DEFAULT '0' COMMENT 'Maximum days allowed after regular deadline',
  PRIMARY KEY (`event_id`),
  KEY `fk_exam_event_institution` (`institution_id`) USING BTREE,
  KEY `fk_exam_event_academic` (`academic_id`) USING BTREE,
  KEY `fk_exam_event_semester` (`semester_id`) USING BTREE,
  KEY `idx_exam_event_late_reg` (`late_reg_allowed`,`late_reg_deadline`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_fees`
--

DROP TABLE IF EXISTS `exam_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_fees` (
  `fee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programme_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `late_fee` decimal(10,2) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`fee_id`),
  UNIQUE KEY `uk_programme_semester_fees` (`programme_id`,`semester_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_pattern`
--

DROP TABLE IF EXISTS `exam_pattern`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_pattern` (
  `pattern_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programm_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pattern_name` varchar(200) NOT NULL,
  `grading_type` varchar(20) DEFAULT 'absolute',
  `grace_marks_allowed` int DEFAULT '0',
  `grace_marks_max` int DEFAULT '0',
  `atkt_rule` text,
  `rounding_rule` varchar(100) DEFAULT NULL,
  `passing_criteria` text,
  `detention_criteria` text,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`pattern_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_registration`
--

DROP TABLE IF EXISTS `exam_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_registration` (
  `exam_reg_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Student ID (UUID from students table)',
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Exam event ID (UUID from exam_event table)',
  `reg_type` varchar(30) DEFAULT 'regular' COMMENT 'regular, backlog, improvement, late',
  `reg_status` varchar(30) DEFAULT 'pending' COMMENT 'pending, approved, rejected, payment_pending, completed',
  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'User UID who approved the registration',
  `rejection_reason` text,
  `rejected_at` datetime DEFAULT NULL,
  `rejected_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'User UID who rejected the registration',
  `approval_notes` text,
  `fee_amount` decimal(10,2) DEFAULT '0.00',
  `payment_status` varchar(30) DEFAULT 'pending' COMMENT 'pending, completed, failed, refunded',
  `payment_transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `hall_ticket_hold_override` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`exam_reg_id`),
  UNIQUE KEY `uq_stud_event` (`sid`,`event_id`) USING BTREE,
  KEY `idx_er_sid` (`sid`) USING BTREE,
  KEY `idx_exam_reg_payment_status` (`payment_status`) USING BTREE,
  KEY `idx_exam_reg_approved_by` (`approved_by`) USING BTREE,
  KEY `idx_exam_reg_status` (`reg_status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `external_examiner`
--

DROP TABLE IF EXISTS `external_examiner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_examiner` (
  `examiner_id` int NOT NULL AUTO_INCREMENT,
  `examiner_name` varchar(255) NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `eligible_subjects` json DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`examiner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `faculty_clg_id` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contact` varchar(11) DEFAULT NULL,
  `ftype_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role` varchar(150) DEFAULT NULL,
  `depart_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `privilege` int DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `pan_no` varchar(50) DEFAULT NULL,
  `aadhar_card` varchar(50) DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `permanent_address` text,
  `current_address` text,
  `alternate_mobile` varchar(15) DEFAULT NULL,
  `experience_details` text,
  `photo` text,
  `signature` text,
  `cv` text,
  `email` varchar(255) DEFAULT NULL,
  `branch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `idx_faculty_contact` (`contact`) USING BTREE,
  UNIQUE KEY `idx_faculty_email` (`email`) USING BTREE,
  KEY `idx_faculty_faculty_clg_id` (`faculty_clg_id`) USING BTREE,
  KEY `idx_faculty_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faculty_availability`
--

DROP TABLE IF EXISTS `faculty_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_availability` (
  `avail_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unavail_date` date DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`avail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faculty_subject_mapping`
--

DROP TABLE IF EXISTS `faculty_subject_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_subject_mapping` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `faculty_role` varchar(50) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faculty_type`
--

DROP TABLE IF EXISTS `faculty_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_type` (
  `ftype_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`ftype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_receipt`
--

DROP TABLE IF EXISTS `fee_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_receipt` (
  `receipt_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `txn_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size_kb` int DEFAULT NULL,
  `generated_at` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`receipt_id`),
  KEY `txn_id` (`txn_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_transaction`
--

DROP TABLE IF EXISTS `fee_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_transaction` (
  `txn_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_reg_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_mode` varchar(30) DEFAULT NULL,
  `txn_reference` varchar(255) DEFAULT NULL,
  `txn_status` enum('initiated','pending','success','failed') DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`txn_id`),
  KEY `idx_fee_transaction_exam_reg_id` (`razorpay_order_id`) USING BTREE,
  KEY `idx_exam_reg` (`exam_reg_id`) USING BTREE,
  KEY `idx_ft_exam_reg_status` (`exam_reg_id`,`txn_status`,`deletedAt`,`paid_at`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gender_master`
--

DROP TABLE IF EXISTS `gender_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender_master` (
  `gender_id` int NOT NULL AUTO_INCREMENT,
  `gender_name` varchar(50) NOT NULL,
  PRIMARY KEY (`gender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hall_ticket`
--

DROP TABLE IF EXISTS `hall_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall_ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `exam_reg_id` int DEFAULT NULL,
  `generated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_blocked` tinyint(1) DEFAULT '0',
  `block_reason` varchar(500) DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hall_ticket_settings`
--

DROP TABLE IF EXISTS `hall_ticket_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall_ticket_settings` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `hall_ticket_status` enum('enabled','disabled') NOT NULL DEFAULT 'disabled',
  `release_date` date DEFAULT NULL,
  `download_last_date` date DEFAULT NULL,
  `late_exam_required` enum('yes','no') NOT NULL DEFAULT 'no',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `enabled_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `instructions` json DEFAULT NULL,
  `generated_at` datetime DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `scheduled_publish_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_hts_exam_event_id` (`exam_event_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hall_tickets`
--

DROP TABLE IF EXISTS `hall_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall_tickets` (
  `ticket_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `student_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_reg_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `pdf_url` varchar(500) NOT NULL,
  `is_blocked` tinyint(1) DEFAULT '0',
  `block_reason` varchar(500) DEFAULT NULL,
  `generated_at` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `idx_ht_student_id` (`student_id`,`deletedAt`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution` (
  `institution_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `institution_code` varchar(100) DEFAULT NULL,
  `establishment_year` varchar(4) DEFAULT NULL,
  `institution_type` varchar(50) DEFAULT NULL,
  `address` text,
  `road` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `affiliated_university` varchar(255) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `alternate_phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `official_email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `accreditation` json DEFAULT NULL,
  `courses` json DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`institution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marks_entry`
--

DROP TABLE IF EXISTS `marks_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marks_entry` (
  `entry_id` int NOT NULL AUTO_INCREMENT,
  `reg_subj_id` int DEFAULT NULL,
  `faculty_id` int DEFAULT NULL,
  `component` varchar(30) DEFAULT NULL,
  `marks_obtained` decimal(6,2) DEFAULT NULL,
  `max_marks` decimal(6,2) DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT '0',
  `locked_at` datetime DEFAULT NULL,
  `locked_by` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`entry_id`),
  UNIQUE KEY `uq_regsubj_component` (`reg_subj_id`,`component`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marksheet_version`
--

DROP TABLE IF EXISTS `marksheet_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marksheet_version` (
  `version_id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `changed_by` int DEFAULT NULL,
  `change_reason` text,
  `before_json` json DEFAULT NULL,
  `after_json` json DEFAULT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_log`
--

DROP TABLE IF EXISTS `notification_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_log` (
  `notif_id` int NOT NULL AUTO_INCREMENT,
  `recipient_uid` int DEFAULT NULL,
  `channel` varchar(10) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `body_preview` text,
  `notif_status` varchar(20) DEFAULT 'pending',
  `sent_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`notif_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otp_log`
--

DROP TABLE IF EXISTS `otp_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_log` (
  `otp_id` int NOT NULL AUTO_INCREMENT,
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `purpose` varchar(100) DEFAULT NULL,
  `otp_hash` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `attempts` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`otp_id`),
  KEY `idx_otp_log_email_purpose` (`email`,`purpose`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paper_question`
--

DROP TABLE IF EXISTS `paper_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paper_question` (
  `pq_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `set_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'paper_set.set_id (no FK)',
  `q_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'question_bank.q_id (no FK)',
  `sequence_no` int DEFAULT NULL,
  `marks_allocated` int DEFAULT NULL,
  `is_compulsory` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`pq_id`),
  UNIQUE KEY `idx_paper_question_set_q` (`set_id`,`q_id`) USING BTREE,
  KEY `idx_paper_question_set_id` (`set_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paper_set`
--

DROP TABLE IF EXISTS `paper_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paper_set` (
  `set_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'exam_event.event_id (no FK)',
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'subject.subject_id (no FK)',
  `academic_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'academic_year.academic_id (no FK)',
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'semester.semester_id (no FK)',
  `exam_type` varchar(50) DEFAULT NULL,
  `set_name` varchar(150) DEFAULT NULL,
  `instructions` text,
  `submission_deadline` date DEFAULT NULL,
  `paper_status` varchar(30) NOT NULL DEFAULT 'REQUESTED',
  `paper_setter_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'faculty.faculty_id (no FK)',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'users.uid (no FK)',
  `accepted_at` datetime DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_mime_type` varchar(100) DEFAULT NULL,
  `file_size_kb` int DEFAULT NULL,
  `uploaded_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'faculty.faculty_id (no FK)',
  `uploaded_at` datetime DEFAULT NULL,
  `faculty_locked_at` datetime DEFAULT NULL,
  `faculty_locked_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `coe_final_locked_at` datetime DEFAULT NULL,
  `coe_final_locked_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'users.uid (no FK)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`set_id`),
  KEY `idx_paper_set_event_subject` (`event_id`,`subject_id`) USING BTREE,
  KEY `idx_paper_set_setter` (`paper_setter_id`) USING BTREE,
  KEY `idx_paper_set_status` (`paper_status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paper_set_approval`
--

DROP TABLE IF EXISTS `paper_set_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paper_set_approval` (
  `approval_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `set_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'paper_set.set_id (no FK)',
  `moderator_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'users.uid (no FK)',
  `action` varchar(30) DEFAULT NULL,
  `remarks` text,
  `actioned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_id`),
  KEY `idx_paper_set_approval_set_id` (`set_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photocopy_request`
--

DROP TABLE IF EXISTS `photocopy_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photocopy_request` (
  `req_id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `sid` int DEFAULT NULL,
  `req_status` varchar(30) DEFAULT 'pending',
  `fee_paid` decimal(8,2) DEFAULT NULL,
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`req_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programme`
--

DROP TABLE IF EXISTS `programme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programme` (
  `programm_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `institution_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `depart_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programme_name` varchar(255) NOT NULL,
  `programme_code` varchar(20) DEFAULT NULL,
  `degree_type` varchar(50) DEFAULT NULL,
  `duration_years` int DEFAULT NULL,
  `total_semesters` int DEFAULT NULL,
  `approved_intake` int DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`programm_id`),
  KEY `idx_programme_depart_id` (`depart_id`) USING BTREE,
  KEY `idx_programme_institution_id` (`institution_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programme_outcome`
--

DROP TABLE IF EXISTS `programme_outcome`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programme_outcome` (
  `po_id` int NOT NULL AUTO_INCREMENT,
  `programm_id` int DEFAULT NULL,
  `po_code` varchar(20) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`po_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_bank`
--

DROP TABLE IF EXISTS `question_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_bank` (
  `q_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'subject.subject_id (no FK)',
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'faculty.faculty_id (no FK)',
  `chapter` varchar(200) DEFAULT NULL,
  `topic` varchar(300) DEFAULT NULL,
  `question_type` varchar(30) DEFAULT NULL,
  `difficulty` varchar(20) DEFAULT NULL,
  `marks` int DEFAULT NULL,
  `question_text` text,
  `options_json` json DEFAULT NULL,
  `correct_answer` text,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`q_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_co_link`
--

DROP TABLE IF EXISTS `question_co_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_co_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `q_id` int DEFAULT NULL,
  `co_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_co_mapping`
--

DROP TABLE IF EXISTS `question_co_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_co_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pq_id` int DEFAULT NULL,
  `co_id` int DEFAULT NULL,
  `weightage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reassessment_request`
--

DROP TABLE IF EXISTS `reassessment_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reassessment_request` (
  `reas_id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `sid` int DEFAULT NULL,
  `reas_status` varchar(30) DEFAULT 'pending',
  `fee_paid` decimal(8,2) DEFAULT NULL,
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`reas_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `registration_subject`
--

DROP TABLE IF EXISTS `registration_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration_subject` (
  `reg_subj_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_reg_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `mapping_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject_type` varchar(20) DEFAULT 'regular',
  `eligibility_status` varchar(30) DEFAULT 'eligible',
  PRIMARY KEY (`reg_subj_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `result_record`
--

DROP TABLE IF EXISTS `result_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result_record` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `reg_subj_id` int DEFAULT NULL,
  `ia_total` decimal(6,2) DEFAULT NULL,
  `ese_total` decimal(6,2) DEFAULT NULL,
  `total_marks` decimal(6,2) DEFAULT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `result_status` varchar(10) DEFAULT NULL,
  `grace_applied` tinyint(1) DEFAULT '0',
  `computed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `revaluation_request`
--

DROP TABLE IF EXISTS `revaluation_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `revaluation_request` (
  `rev_id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `sid` int DEFAULT NULL,
  `assigned_evaluator` int DEFAULT NULL,
  `revised_marks` decimal(6,2) DEFAULT NULL,
  `rev_status` varchar(30) DEFAULT 'pending',
  `fee_paid` decimal(8,2) DEFAULT NULL,
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`rev_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rhr_student`
--

DROP TABLE IF EXISTS `rhr_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rhr_student` (
  `rhr_id` int NOT NULL AUTO_INCREMENT,
  `result_id` int DEFAULT NULL,
  `reason` text,
  `is_resolved` tinyint(1) DEFAULT '0',
  `resolved_by` int DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`rhr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `building_id` int DEFAULT NULL,
  `room_name` varchar(100) NOT NULL,
  `floor` int DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scheme`
--

DROP TABLE IF EXISTS `scheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheme` (
  `scheme_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programm_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `scheme_name` varchar(200) NOT NULL,
  `scheme_year` int DEFAULT NULL,
  `description` text,
  `status` enum('active','inactive','draft') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`scheme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seat_type_master`
--

DROP TABLE IF EXISTS `seat_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_type_master` (
  `seat_type_id` int NOT NULL AUTO_INCREMENT,
  `seat_type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`seat_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `semester`
--

DROP TABLE IF EXISTS `semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester` (
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `programm_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `academic_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `semester_number` int NOT NULL,
  `term` varchar(10) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`semester_id`),
  KEY `idx_semester_programm_id` (`programm_id`) USING BTREE,
  KEY `idx_semester_academic_id` (`academic_id`) USING BTREE,
  KEY `idx_semester_is_active` (`is_active`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `semester_result`
--

DROP TABLE IF EXISTS `semester_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_result` (
  `sem_result_id` int NOT NULL AUTO_INCREMENT,
  `sid` int DEFAULT NULL,
  `semester_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `aggregate_marks` decimal(8,2) DEFAULT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `sgpa` decimal(4,2) DEFAULT NULL,
  `cgpa` decimal(4,2) DEFAULT NULL,
  `overall_status` varchar(20) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `computed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sem_result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `semester_subject_mapping`
--

DROP TABLE IF EXISTS `semester_subject_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_subject_mapping` (
  `mapping_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `branch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `exam_event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `mapped_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`mapping_id`),
  UNIQUE KEY `uq_sem_branch_subj_event` (`semester_id`,`branch_id`,`subject_id`,`exam_event_id`) USING BTREE,
  KEY `idx_mapping_semester` (`semester_id`) USING BTREE,
  KEY `idx_mapping_branch` (`branch_id`) USING BTREE,
  KEY `idx_mapping_subject` (`subject_id`) USING BTREE,
  KEY `idx_mapping_event` (`exam_event_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shift_master`
--

DROP TABLE IF EXISTS `shift_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_master` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(100) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_add`
--

DROP TABLE IF EXISTS `student_add`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_add` (
  `sadd_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `domicile_number` varchar(500) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `building_number` varchar(50) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sadd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_doc_link`
--

DROP TABLE IF EXISTS `student_doc_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_doc_link` (
  `doc_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `cap_allotment_letter` varchar(255) DEFAULT NULL,
  `fc_center_verification` varchar(255) DEFAULT NULL,
  `ssc_marksheet` varchar(255) DEFAULT NULL,
  `hsc_marksheet` varchar(255) DEFAULT NULL,
  `lc` varchar(255) DEFAULT NULL,
  `mht_cet_score_card` varchar(255) DEFAULT NULL,
  `caste_certificate` varchar(255) DEFAULT NULL,
  `caste_validation` varchar(255) DEFAULT NULL,
  `domicile` varchar(255) DEFAULT NULL,
  `aadhar_card` varchar(255) DEFAULT NULL,
  `ration_card` varchar(255) DEFAULT NULL,
  `back_passbook` varchar(255) DEFAULT NULL,
  `income_certificate` varchar(255) DEFAULT NULL,
  `fee_receipt` varchar(255) DEFAULT NULL,
  `college_admission_letter` varchar(255) DEFAULT NULL,
  `jee_score_card` varchar(255) DEFAULT NULL,
  `nonCreamy` varchar(255) DEFAULT NULL,
  `ews_pro` varchar(255) DEFAULT NULL,
  `parentSignature` varchar(255) DEFAULT NULL,
  `antiragging_form` varchar(255) DEFAULT NULL,
  `gap_cert` varchar(255) DEFAULT NULL,
  `dep_marksheet` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_parentdetail`
--

DROP TABLE IF EXISTS `student_parentdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_parentdetail` (
  `parent_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullname` varchar(500) DEFAULT NULL,
  `contact` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `occupation` varchar(200) DEFAULT NULL,
  `designation` varchar(200) DEFAULT NULL,
  `income` varchar(20) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_personaldetails`
--

DROP TABLE IF EXISTS `student_personaldetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_personaldetails` (
  `personal_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `stud_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `gender_id` int NOT NULL,
  `dob` date DEFAULT NULL,
  `religion` varchar(400) DEFAULT NULL,
  `community` varchar(400) DEFAULT NULL,
  `minority` varchar(100) DEFAULT NULL,
  `caste` varchar(50) DEFAULT NULL,
  `sub_caste` varchar(100) DEFAULT NULL,
  `nationality` varchar(200) DEFAULT NULL,
  `radd_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `padd_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `place_of_birth` varchar(500) DEFAULT NULL,
  `child_number` varchar(4) DEFAULT NULL,
  `landline_number` varchar(10) DEFAULT NULL,
  `contact` varchar(10) DEFAULT NULL,
  `bank_account_number` varchar(20) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `married_status` enum('Single','Married','Divorced','Widowed') DEFAULT NULL,
  `guardian_relation` varchar(50) DEFAULT NULL,
  `aadhar_number` varchar(100) DEFAULT NULL,
  `last_college_attended` varchar(500) DEFAULT NULL,
  `is_parent_have_domicile` enum('Yes','No') DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`personal_id`),
  UNIQUE KEY `idx_student_personaldetails_contact` (`contact`) USING BTREE,
  KEY `idx_student_personaldetails_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_seating`
--

DROP TABLE IF EXISTS `student_seating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_seating` (
  `seating_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `block_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_reg_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `seat_no` varchar(20) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`seating_id`),
  UNIQUE KEY `uq_seating_exam_reg` (`exam_reg_id`,`deletedAt`) USING BTREE,
  UNIQUE KEY `uq_seating_block_seat` (`block_id`,`seat_no`,`deletedAt`) USING BTREE,
  KEY `idx_seating_block_id` (`block_id`) USING BTREE,
  KEY `idx_seating_exam_reg_id` (`exam_reg_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `sid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `stud_clg_id` varchar(30) DEFAULT NULL,
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `program_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cat_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `seat_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `branch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `gr_number` varchar(50) DEFAULT NULL,
  `personal_details_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `father_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `mother_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `guardian_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `physically_handicap` int DEFAULT NULL,
  `defence_status` int DEFAULT NULL,
  `received_scholarship` int DEFAULT NULL,
  `details_of_prize` int DEFAULT NULL,
  `special_talent` int DEFAULT NULL,
  `doc_ids` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `final_submit` int DEFAULT '0',
  `HDegree` varchar(200) DEFAULT NULL,
  `part_payment` int DEFAULT NULL,
  `dd_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `neft_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cancelled_app` int DEFAULT '0',
  `cancelled_app_date` varchar(20) DEFAULT NULL,
  `cancelled_app_document` varchar(255) DEFAULT NULL,
  `RowNum` bigint unsigned NOT NULL DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `idx_students_stud_clg_id` (`stud_clg_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `scheme_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject_code` varchar(50) DEFAULT NULL,
  `subject_name` varchar(255) NOT NULL,
  `subject_type` varchar(20) DEFAULT NULL,
  `credits` int DEFAULT NULL,
  `max_theory` int DEFAULT '0',
  `max_practical` int DEFAULT '0',
  `max_oral` int DEFAULT '0',
  `max_tw` int DEFAULT '0',
  `min_pass_theory` int DEFAULT '0',
  `min_pass_practical` int DEFAULT '0',
  `exam_duration_min` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `branch_id` int DEFAULT NULL,
  `sem` int DEFAULT NULL,
  `acad_year` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`subject_id`),
  KEY `idx_subject_scheme_id` (`scheme_id`) USING BTREE,
  KEY `idx_subject_branch_id` (`branch_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supervisor_allocation`
--

DROP TABLE IF EXISTS `supervisor_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_allocation` (
  `duty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `timetable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `room_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `duty_status` varchar(30) DEFAULT 'assigned',
  `assigned_at` datetime DEFAULT NULL,
  `accepted_at` datetime DEFAULT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`duty_id`),
  UNIQUE KEY `uq_supervisor_faculty_timetable` (`faculty_id`,`timetable_id`) USING BTREE,
  KEY `idx_supervisor_faculty_id` (`faculty_id`) USING BTREE,
  KEY `idx_supervisor_timetable_id` (`timetable_id`) USING BTREE,
  KEY `idx_supervisor_faculty_status` (`faculty_id`,`duty_status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `time_slot`
--

DROP TABLE IF EXISTS `time_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slot` (
  `slot_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `slot_label` varchar(50) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`slot_id`),
  KEY `idx_time_slot_event` (`event_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `timetable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `mapping_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `exam_date` date NOT NULL,
  `slot_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `shift` varchar(20) DEFAULT 'MORNING',
  `is_published` tinyint(1) DEFAULT '0',
  `status` varchar(30) DEFAULT 'scheduled',
  `rescheduled_from` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `reschedule_reason` text,
  `venue` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`timetable_id`),
  UNIQUE KEY `uq_timetable_event_mapping` (`event_id`,`mapping_id`) USING BTREE,
  KEY `idx_timetable_event` (`event_id`) USING BTREE,
  KEY `idx_timetable_mapping` (`mapping_id`) USING BTREE,
  KEY `idx_timetable_slot` (`slot_id`) USING BTREE,
  KEY `idx_timetable_date` (`exam_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_auth_token`
--

DROP TABLE IF EXISTS `user_auth_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_auth_token` (
  `auth_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `token` longtext NOT NULL COMMENT 'The full JWT token',
  `token_hash` varchar(64) NOT NULL COMMENT 'SHA-256 hash of the token for fast, unique lookups',
  `expires_at` datetime NOT NULL COMMENT 'When this token expires — used for cleanup and validation',
  `user_type` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `login_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`auth_id`),
  UNIQUE KEY `idx_user_auth_token_hash` (`token_hash`) USING BTREE,
  KEY `idx_user_auth_token_uid` (`uid`) USING BTREE,
  KEY `idx_user_auth_token_expires_at` (`expires_at`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_types`
--

DROP TABLE IF EXISTS `user_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_types` (
  `utid` int NOT NULL,
  `base` varchar(50) NOT NULL COMMENT 'Unique identifier for the user type. For example: ''Admin'', ''Faculty'', ''Student'', ''Alumni'', ''External'', ''COE''',
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`utid`),
  UNIQUE KEY `idx_user_types_base` (`base`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_type` int DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL COMMENT 'Nullable for future SSO / OAuth users',
  `student_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Set when utid resolves to Student type',
  `faculty_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Set when utid resolves to Faculty type',
  `coe_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Set when utid resolves to COE type',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `idx_users_email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_payment_history`
--

DROP TABLE IF EXISTS `v_payment_history`;
/*!50001 DROP VIEW IF EXISTS `v_payment_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_payment_history` AS SELECT 
 1 AS `txn_id`,
 1 AS `exam_reg_id`,
 1 AS `amount`,
 1 AS `payment_mode`,
 1 AS `txn_status`,
 1 AS `razorpay_order_id`,
 1 AS `razorpay_payment_id`,
 1 AS `paid_at`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `sid`,
 1 AS `reg_status`,
 1 AS `event_id`,
 1 AS `event_name`,
 1 AS `exam_type`,
 1 AS `fee_regular`,
 1 AS `fee_backlog`,
 1 AS `student_name`,
 1 AS `student_email`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'ems'
--

--
-- Dumping routines for database 'ems'
--

--
-- Final view structure for view `v_payment_history`
--

/*!50001 DROP VIEW IF EXISTS `v_payment_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_payment_history` AS select `ft`.`txn_id` AS `txn_id`,`ft`.`exam_reg_id` AS `exam_reg_id`,`ft`.`amount` AS `amount`,`ft`.`payment_mode` AS `payment_mode`,`ft`.`txn_status` AS `txn_status`,`ft`.`razorpay_order_id` AS `razorpay_order_id`,`ft`.`razorpay_payment_id` AS `razorpay_payment_id`,`ft`.`paid_at` AS `paid_at`,`ft`.`createdAt` AS `createdAt`,`ft`.`updatedAt` AS `updatedAt`,`er`.`sid` AS `sid`,`er`.`reg_status` AS `reg_status`,`ee`.`event_id` AS `event_id`,`ee`.`event_name` AS `event_name`,`ee`.`exam_type` AS `exam_type`,`ee`.`fee_regular` AS `fee_regular`,`ee`.`fee_backlog` AS `fee_backlog`,`pd`.`name` AS `student_name`,`pd`.`email` AS `student_email` from ((((`fee_transaction` `ft` join `exam_registration` `er` on((`ft`.`exam_reg_id` = `er`.`exam_reg_id`))) join `exam_event` `ee` on((`er`.`event_id` = `ee`.`event_id`))) left join `students` `s` on((`er`.`sid` = `s`.`sid`))) left join `student_personaldetails` `pd` on((`s`.`sid` = `pd`.`stud_id`))) where (`ft`.`deletedAt` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 13:59:07
