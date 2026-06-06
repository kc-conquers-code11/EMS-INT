SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE supervisor_allocation;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO supervisor_allocation (
  duty_id, timetable_id, room_id, faculty_id, duty_status, assigned_at, accepted_at, remarks, created_at, updated_at
) VALUES
('sup11111-1111-4111-8111-111111111111', @tt_cs101, 'd1b2c3d4-e5f6-7890-abcd-ef1234567801', 'f739f88f-fec7-4aa9-92b1-4636d62a828d', 'assigned', @now, NULL, NULL, @now, @now),
('sup22222-2222-4222-8222-222222222222', @tt_cs101, 'd1b2c3d4-e5f6-7890-abcd-ef1234567802', 'f739f88f-fec7-4aa9-92b1-4636d62a828e', 'accepted', @now, @now, NULL, @now, @now);
