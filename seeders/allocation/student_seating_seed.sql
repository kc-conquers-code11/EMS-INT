SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE student_seating;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO student_seating (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
VALUES
('e1b2c3d4-e5f6-7890-abcd-ef1234567801', 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', @reg_alice_jury, 'A-01', @now, @now, NULL),
('e1b2c3d4-e5f6-7890-abcd-ef1234567802', 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'f7c32e14-72eb-4752-9b0d-0346c7dc2d6a', 'A-02', @now, @now, NULL);
