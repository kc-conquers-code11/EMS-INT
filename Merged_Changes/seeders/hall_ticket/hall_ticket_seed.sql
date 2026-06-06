-- Legacy global settings + sample hall_tickets rows (idempotent; paths match hallTicket.helper)
SOURCE seed_constants.sql;

-- Legacy singleton settings (global download toggle — optional)
INSERT INTO hall_ticket_settings (
  id, is_enabled, enabled_by, instructions, generated_at, createdAt, updatedAt
)
SELECT
  @ht_settings_legacy, 1, @admin_coe,
  JSON_ARRAY(
    'Arrive 30 minutes early.',
    'Carry hall ticket and photo ID.',
    'No electronic devices in the exam hall.'
  ),
  @now, @now, @now
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM hall_ticket_settings WHERE id = @ht_settings_legacy);

-- Soft-remove outdated / duplicate tickets for Summer 2026 (keep canonical seed rows only)
UPDATE hall_tickets SET deletedAt = @now, updatedAt = @now
WHERE exam_reg_id IN (@reg_alice_summer, @reg_bob_summer)
  AND ticket_id NOT IN (@ht_alice_summer, @ht_bob_summer)
  AND deletedAt IS NULL;

UPDATE hall_tickets SET deletedAt = @now, updatedAt = @now
WHERE ticket_id IN (
  'ht111111-1111-4111-8111-111111111111',
  'ht222222-2222-4222-8222-222222222222'
) AND deletedAt IS NULL;

-- Summer 2026 sample PDF records (std1 STU001 / std2 STU002 under branch folder CSE)
INSERT INTO hall_tickets (
  ticket_id, student_id, exam_reg_id, file_name, file_path, pdf_url,
  is_blocked, block_reason, generated_at, createdAt, updatedAt, deletedAt
)
VALUES (
  @ht_alice_summer, @stu_alice, @reg_alice_summer,
  'hall_ticket.pdf',
  'uploads/students/CSE/STU001/hall_ticket.pdf',
  '/uploads/students/CSE/STU001/hall_ticket.pdf',
  0, NULL, @now, @now, @now, NULL
)
ON DUPLICATE KEY UPDATE
  exam_reg_id = VALUES(exam_reg_id),
  file_name = VALUES(file_name),
  file_path = VALUES(file_path),
  pdf_url = VALUES(pdf_url),
  deletedAt = NULL,
  updatedAt = @now;

INSERT INTO hall_tickets (
  ticket_id, student_id, exam_reg_id, file_name, file_path, pdf_url,
  is_blocked, block_reason, generated_at, createdAt, updatedAt, deletedAt
)
VALUES (
  @ht_bob_summer, @stu_bob, @reg_bob_summer,
  'hall_ticket.pdf',
  'uploads/students/CSE/STU002/hall_ticket.pdf',
  '/uploads/students/CSE/STU002/hall_ticket.pdf',
  0, NULL, @now, @now, @now, NULL
)
ON DUPLICATE KEY UPDATE
  exam_reg_id = VALUES(exam_reg_id),
  file_name = VALUES(file_name),
  file_path = VALUES(file_path),
  pdf_url = VALUES(pdf_url),
  deletedAt = NULL,
  updatedAt = @now;
