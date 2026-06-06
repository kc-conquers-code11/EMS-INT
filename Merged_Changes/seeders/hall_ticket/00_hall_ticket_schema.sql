-- Idempotent hall-ticket schema patches (safe to re-run via run_all_seeds.sh)
SET @db = DATABASE();

-- hall_ticket_settings: per-event columns
SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'hall_ticket_settings' AND COLUMN_NAME = 'exam_event_id');
SET @sql = IF(@c = 0,
  'ALTER TABLE hall_ticket_settings
     ADD COLUMN exam_event_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL AFTER id,
     ADD COLUMN hall_ticket_status enum(''enabled'',''disabled'') NOT NULL DEFAULT ''disabled'' AFTER exam_event_id,
     ADD COLUMN release_date date DEFAULT NULL AFTER hall_ticket_status,
     ADD COLUMN download_last_date date DEFAULT NULL AFTER release_date,
     ADD COLUMN late_exam_required enum(''yes'',''no'') NOT NULL DEFAULT ''no'' AFTER download_last_date',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'hall_ticket_settings' AND INDEX_NAME = 'idx_hts_exam_event_id');
SET @sql = IF(@c = 0, 'CREATE INDEX idx_hts_exam_event_id ON hall_ticket_settings (exam_event_id)', 'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'hall_ticket_settings' AND COLUMN_NAME = 'published_at');
SET @sql = IF(@c = 0, 'ALTER TABLE hall_ticket_settings ADD COLUMN published_at DATETIME NULL', 'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'hall_ticket_settings' AND COLUMN_NAME = 'scheduled_publish_at');
SET @sql = IF(@c = 0, 'ALTER TABLE hall_ticket_settings ADD COLUMN scheduled_publish_at DATETIME NULL', 'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- exam_registration: COE hold override
SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'exam_registration' AND COLUMN_NAME = 'hall_ticket_hold_override');
SET @sql = IF(@c = 0,
  'ALTER TABLE exam_registration ADD COLUMN hall_ticket_hold_override tinyint(1) NOT NULL DEFAULT 0',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
