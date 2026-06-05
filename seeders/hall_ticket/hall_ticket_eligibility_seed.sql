-- Summer 2026 hall ticket: settings, branches, timetable, seating, eligibility (idempotent)
SOURCE seed_constants.sql;

-- One settings row per exam event (remove duplicates from older seeds / UI saves)
DELETE FROM hall_ticket_settings
WHERE exam_event_id = @event_summer_2026 AND id <> @hts_summer;

-- Branch used by std1@ems.com (Alice) — hall ticket path uses branch_code CSE
INSERT INTO branch (
  branch_id, programm_id, depart_id, branch_name, branch_code,
  total_intake, accreditation_status, established_year, status, createdAt, updatedAt
)
SELECT
  @branch_admin_cse, @prog_be_ce, @dept_ce,
  'Computer Science & Engineering', 'CSE',
  120, 'NBA Accredited', 1993, 1, @now, @now
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM branch WHERE branch_id = @branch_admin_cse);

-- Per-event hall ticket settings (COE tab: disabled until Publish; release window open for testing)
INSERT INTO hall_ticket_settings (
  id, exam_event_id, hall_ticket_status, release_date, download_last_date,
  late_exam_required, is_enabled, instructions, published_at, scheduled_publish_at,
  generated_at, createdAt, updatedAt
)
VALUES (
  @hts_summer, @event_summer_2026, 'disabled', '2026-01-01', '2026-12-31', 'no', 0,
  JSON_ARRAY(
    'Carry a valid college ID card and hall ticket printout.',
    'Report to the exam centre 30 minutes before the scheduled time.',
    'Electronic devices are not permitted inside the examination hall.'
  ),
  NULL, NULL, @now, @now, @now
)
ON DUPLICATE KEY UPDATE
  hall_ticket_status = VALUES(hall_ticket_status),
  release_date = VALUES(release_date),
  download_last_date = VALUES(download_last_date),
  late_exam_required = VALUES(late_exam_required),
  is_enabled = VALUES(is_enabled),
  instructions = VALUES(instructions),
  updatedAt = @now;

-- Exam event published flag (student portal checks is_published after COE publish job)
UPDATE exam_event
SET is_published = 0, status = 'published', updatedAt = @now
WHERE event_id = @event_summer_2026;

-- Subject mapping + timetable for Summer 2026 (PDF exam schedule)
INSERT INTO semester_subject_mapping (mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, createdAt, updatedAt)
SELECT @map_summer_cs101, @sem_cse_6_even, @branch_cse, @subj_cs101, @event_summer_2026, 1, @now, @now
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM semester_subject_mapping WHERE mapping_id = @map_summer_cs101);

INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
SELECT @reg_subj_alice_sum, @reg_alice_summer, @map_summer_cs101, 'regular', 'eligible'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM registration_subject WHERE reg_subj_id = @reg_subj_alice_sum);

INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
SELECT @reg_subj_bob_sum, @reg_bob_summer, @map_summer_cs101, 'regular', 'eligible'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM registration_subject WHERE reg_subj_id = @reg_subj_bob_sum);

-- Eva (backlog): theory + practical subjects linked to Summer 2026 timetable
INSERT INTO semester_subject_mapping (mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, createdAt, updatedAt)
SELECT @map_summer_cs101p, @sem_cse_6_even, @branch_cse, @subj_cs101p, @event_summer_2026, 1, @now, @now
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM semester_subject_mapping WHERE mapping_id = @map_summer_cs101p);

INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
SELECT @reg_subj_eva_sum, @reg_eva_summer, @map_summer_cs101, 'backlog', 'eligible'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM registration_subject WHERE reg_subj_id = @reg_subj_eva_sum);

INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
SELECT @reg_subj_eva_sum_p, @reg_eva_summer, @map_summer_cs101p, 'backlog', 'eligible'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM registration_subject WHERE reg_subj_id = @reg_subj_eva_sum_p);

INSERT INTO time_slot (slot_id, event_id, slot_label, start_time, end_time)
SELECT @slot_summer_morn, @event_summer_2026, 'Morning', '10:00:00', '13:00:00'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM time_slot WHERE slot_id = @slot_summer_morn);

INSERT INTO timetable (timetable_id, event_id, mapping_id, exam_date, slot_id, shift, is_published)
SELECT @tt_summer_cs101, @event_summer_2026, @map_summer_cs101, '2026-06-20', @slot_summer_morn, 'Morning', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM timetable WHERE timetable_id = @tt_summer_cs101);

INSERT INTO time_slot (slot_id, event_id, slot_label, start_time, end_time)
SELECT @slot_summer_after, @event_summer_2026, 'Afternoon', '14:00:00', '17:00:00'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM time_slot WHERE slot_id = @slot_summer_after);

INSERT INTO timetable (timetable_id, event_id, mapping_id, exam_date, slot_id, shift, is_published)
SELECT @tt_summer_cs101p, @event_summer_2026, @map_summer_cs101p, '2026-06-21', @slot_summer_after, 'Afternoon', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM timetable WHERE timetable_id = @tt_summer_cs101p);

-- Seating for PDF seat numbers
INSERT INTO student_seating (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
SELECT @seat_alice_summer, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', @reg_alice_summer, 'CSE-A01', @now, @now, NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM student_seating WHERE seating_id = @seat_alice_summer);

INSERT INTO student_seating (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
SELECT @seat_bob_summer, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', @reg_bob_summer, 'CSE-A02', @now, @now, NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM student_seating WHERE seating_id = @seat_bob_summer);

INSERT INTO student_seating (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
SELECT @seat_eva_summer, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', @reg_eva_summer, 'CSE-A05', @now, @now, NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM student_seating WHERE seating_id = @seat_eva_summer);

-- Align registration student ids with EMS admin students (std1 / std2)
UPDATE exam_registration SET sid = @stu_alice, updatedAt = @now WHERE exam_reg_id = @reg_alice_summer;
UPDATE exam_registration SET sid = @stu_bob, updatedAt = @now WHERE exam_reg_id = @reg_bob_summer;

-- Eligible: Alice + Bob (EMS std1 / std2) — paid + approved
UPDATE exam_registration SET
  payment_status = 'completed', payment_date = @now, approved_at = @now,
  reg_status = 'confirmed', hall_ticket_hold_override = 0, updatedAt = @now
WHERE exam_reg_id IN (@reg_alice_summer, @reg_bob_summer);

-- Demo ineligible rows (hall ticket UI filters)
UPDATE exam_registration SET
  payment_status = 'pending', approved_at = NULL, payment_date = NULL, updatedAt = @now
WHERE exam_reg_id = @reg_carol_summer;

UPDATE exam_registration SET
  payment_status = 'completed', payment_date = @now, approved_at = NULL, updatedAt = @now
WHERE exam_reg_id = @reg_eva_summer;

-- Ensure EMS login students have summer registrations (admin + demo seed alignment)
INSERT INTO exam_registration (
  exam_reg_id, sid, event_id, reg_type, reg_status, registered_at,
  approved_at, fee_amount, payment_status, payment_date, hall_ticket_hold_override,
  createdAt, updatedAt
)
SELECT @reg_alice_summer, @stu_alice, @event_summer_2026, 'regular', 'confirmed', @now, @now, 1500.00, 'completed', @now, 0, @now, @now
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM exam_registration WHERE exam_reg_id = @reg_alice_summer);

INSERT INTO exam_registration (
  exam_reg_id, sid, event_id, reg_type, reg_status, registered_at,
  approved_at, fee_amount, payment_status, payment_date, hall_ticket_hold_override,
  createdAt, updatedAt
)
SELECT @reg_bob_summer, @stu_bob, @event_summer_2026, 'regular', 'confirmed', @now, @now, 1500.00, 'completed', @now, 0, @now, @now
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM exam_registration WHERE exam_reg_id = @reg_bob_summer);

SELECT ee.event_name, COUNT(er.exam_reg_id) AS registrations
FROM exam_event ee
LEFT JOIN exam_registration er ON er.event_id = ee.event_id AND er.reg_status = 'confirmed'
WHERE ee.event_id = @event_summer_2026
GROUP BY ee.event_name;
