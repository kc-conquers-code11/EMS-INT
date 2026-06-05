-- Idempotent patch: Eva Sharma Summer 2026 exam schedule (registration_subject + timetable)
-- Run from seeders/: mysql -u USER -p DB < hall_ticket/hall_ticket_eva_schedule_patch.sql
SOURCE seed_constants.sql;

INSERT INTO semester_subject_mapping (mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, createdAt, updatedAt)
SELECT @map_summer_cs101, @sem_cse_6_even, @branch_cse, @subj_cs101, @event_summer_2026, 1, @now, @now
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM semester_subject_mapping WHERE mapping_id = @map_summer_cs101);

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

INSERT INTO time_slot (slot_id, event_id, slot_label, start_time, end_time)
SELECT @slot_summer_after, @event_summer_2026, 'Afternoon', '14:00:00', '17:00:00'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM time_slot WHERE slot_id = @slot_summer_after);

INSERT INTO timetable (timetable_id, event_id, mapping_id, exam_date, slot_id, shift, is_published)
SELECT @tt_summer_cs101, @event_summer_2026, @map_summer_cs101, '2026-06-20', @slot_summer_morn, 'Morning', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM timetable WHERE timetable_id = @tt_summer_cs101);

INSERT INTO timetable (timetable_id, event_id, mapping_id, exam_date, slot_id, shift, is_published)
SELECT @tt_summer_cs101p, @event_summer_2026, @map_summer_cs101p, '2026-06-21', @slot_summer_after, 'Afternoon', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM timetable WHERE timetable_id = @tt_summer_cs101p);

INSERT INTO student_seating (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
SELECT @seat_eva_summer, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', @reg_eva_summer, 'CSE-A05', @now, @now, NULL
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM student_seating WHERE seating_id = @seat_eva_summer);
