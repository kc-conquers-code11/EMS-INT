-- Question paper upload workflow (UUID, indexes only — no foreign keys).
-- Safe to run on dev; backup production data first.

CREATE TABLE IF NOT EXISTS `paper_set` (
  `set_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `academic_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `semester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `exam_type` varchar(50) DEFAULT NULL,
  `set_name` varchar(150) DEFAULT NULL,
  `instructions` text,
  `submission_deadline` date DEFAULT NULL,
  `paper_status` varchar(30) NOT NULL DEFAULT 'REQUESTED',
  `paper_setter_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `accepted_at` datetime DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_mime_type` varchar(100) DEFAULT NULL,
  `file_size_kb` int DEFAULT NULL,
  `uploaded_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `uploaded_at` datetime DEFAULT NULL,
  `faculty_locked_at` datetime DEFAULT NULL,
  `faculty_locked_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `coe_final_locked_at` datetime DEFAULT NULL,
  `coe_final_locked_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`set_id`),
  KEY `idx_paper_set_event_subject` (`event_id`,`subject_id`),
  KEY `idx_paper_set_setter` (`paper_setter_id`),
  KEY `idx_paper_set_status` (`paper_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `paper_set_approval` (
  `approval_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `set_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `moderator_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `action` varchar(30) DEFAULT NULL,
  `remarks` text,
  `actioned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_id`),
  KEY `idx_paper_set_approval_set_id` (`set_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
