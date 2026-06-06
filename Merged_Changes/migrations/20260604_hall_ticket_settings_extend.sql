-- Extend hall_ticket_settings for per-exam-event configuration (no FK constraints)
-- Run once against your EMS database before using the new hall ticket settings APIs.

ALTER TABLE `hall_ticket_settings`
  ADD COLUMN `exam_event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL AFTER `id`,
  ADD COLUMN `hall_ticket_status` enum('enabled','disabled') NOT NULL DEFAULT 'disabled' AFTER `exam_event_id`,
  ADD COLUMN `release_date` date DEFAULT NULL AFTER `hall_ticket_status`,
  ADD COLUMN `download_last_date` date DEFAULT NULL AFTER `release_date`,
  ADD COLUMN `late_exam_required` enum('yes','no') NOT NULL DEFAULT 'no' AFTER `download_last_date`;

CREATE INDEX `idx_hts_exam_event_id` ON `hall_ticket_settings` (`exam_event_id`);
