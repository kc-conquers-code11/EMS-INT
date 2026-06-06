SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE semester_subject_mapping;
TRUNCATE TABLE registration_subject;
TRUNCATE TABLE time_slot;
TRUNCATE TABLE timetable;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO semester_subject_mapping (mapping_id, semester_id, branch_id, subject_id, is_active, createdAt, updatedAt)
VALUES (@map_cs101, @sem_cse_6_even, @branch_cse, @subj_cs101, 1, @now, @now);

INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
VALUES (@reg_subj_cs101, @reg_alice_jury, @map_cs101, 'regular', 'eligible');

INSERT INTO time_slot (slot_id, event_id, slot_label, start_time, end_time)
VALUES (@slot_morning, @event_jury, 'Morning', '10:00:00', '13:00:00');

INSERT INTO timetable (timetable_id, event_id, mapping_id, exam_date, slot_id, shift, is_published)
VALUES (@tt_cs101, @event_jury, @map_cs101, '2026-06-15', @slot_morning, 'Morning', 1);
