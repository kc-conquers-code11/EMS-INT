-- Exam fees & events (schema: UUID academic_id, semester.programme_id + term_type)
SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE exam_fees;
TRUNCATE TABLE exam_event;
SET FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO academic_year (academic_id, academic_name, is_admission, current_ay, created_at, updatedAt) VALUES
(@acad_2024_25, '2024-25', 1, 1, @now, @now),
('8751f41c-cfc3-428c-ab19-6cf51a1ef409', '2025-26', 0, 0, @now, @now),
('7935bb34-def7-400f-a9b7-3b2b7998ce96', '2026-27', 0, 0, @now, @now),
('5bf413e9-a0ec-44e7-ab88-8ddd9a8d49aa', '2027-28', 0, 0, @now, @now);

INSERT INTO semester (
  semester_id, programme_id, academic_id, semester_number, term_type,
  start_date, end_date, is_active, branch_id, created_at, updated_at
) VALUES
('30f9982c-7b00-473d-ad61-d810a519063f', @prog_be_ce, @acad_2024_25, 1, 'odd', '2024-08-01', '2024-12-31', 1, @branch_cse, @now, @now),
(@sem_cse_6_even, @prog_be_ce, @acad_2024_25, 6, 'even', '2025-08-01', '2026-05-31', 1, @branch_cse, @now, @now),
(@sem_aiml_4_odd, @prog_be_ce, @acad_2024_25, 4, 'odd', '2025-08-01', '2025-12-31', 1, @branch_aiml, @now, @now)
ON DUPLICATE KEY UPDATE
  programme_id = VALUES(programme_id),
  academic_id = VALUES(academic_id),
  term_type = VALUES(term_type),
  branch_id = VALUES(branch_id),
  updated_at = @now;

INSERT INTO exam_event (
  event_id, institution_id, academic_id, semester_id, event_name, exam_type,
  fee_regular, fee_backlog, is_published, status, createdAt, updatedAt
) VALUES
(@event_summer_2026, @inst_sunrise, @acad_2024_25, @sem_cse_6_even,
 'Summer 2026 Regular Exam', 'regular', 1500.00, 500.00, 1, 'published', @now, @now),
(@event_jury, @inst_sunrise, @acad_2024_25, NULL,
 'Final Term Jury Presentation', 'regular', 2000.00, 1000.00, 1, 'completed', @now, @now),
(@event_backlog, NULL, NULL, NULL,
 'Backlog Practical Exam June 2026', 'backlog', 0.00, 450.00, 1, 'published', @now, @now),
('deff042e-7cbe-48f4-aeca-698b02c20ebc', NULL, NULL, NULL, 'Mid Term Assessment October 2026', 'regular', 500.00, 0.00, 0, 'draft', @now, @now),
('1a206004-1684-4d85-b4b5-4c7d26c44937', NULL, NULL, NULL, 'Semester I Regular Examination', 'regular', 1500.00, 350.00, 0, 'draft', @now, @now),
('a58464af-dc90-4fe2-9a7c-3829c462ad8c', NULL, NULL, NULL, 'Semester II Supplementary Examination', 'backlog', 0.00, 500.00, 1, 'published', @now, @now),
('31ca4a42-22c0-443c-8e16-38d1ebcb7aae', NULL, NULL, NULL, 'Jury Re-evaluation Exam', 'backlog', 0.00, 1500.00, 1, 'published', @now, @now),
('a54ef227-c9fc-4e4c-98df-b5870274a183', NULL, NULL, NULL, 'Phase III Thesis Defense', 'regular', 3000.00, 0.00, 0, 'draft', @now, @now),
('9fae3c6c-ce1c-4f59-bf49-3ff89379676d', NULL, NULL, NULL, 'Special Makeup Examination', 'backlog', 1000.00, 500.00, 1, 'published', @now, @now),
('69bb9e6a-df46-49da-afb3-3f73407f1305', NULL, NULL, NULL, 'Doctoral Qualifying Exam', 'regular', 5000.00, 0.00, 1, 'published', @now, @now);

INSERT INTO exam_fees (fee_id, programme_id, semester_id, amount, late_fee, createdAt, updatedAt) VALUES
('97d45ea5-49a2-41ea-b3b9-f00a7d42a889', @prog_be_ce, '30f9982c-7b00-473d-ad61-d810a519063f', 1200.00, 200.00, @now, @now),
('a1fee001-0001-4001-8001-000000000001', @prog_be_ce, @sem_cse_6_even, 1500.00, 250.00, @now, @now),
('a1fee002-0002-4002-8002-000000000002', @prog_be_ce, @sem_aiml_4_odd, 1400.00, 200.00, @now, @now);
