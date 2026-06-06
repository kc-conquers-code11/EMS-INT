SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE block_allocation;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO block_allocation (
  block_id, timetable_id, room_id, block_no, allocated_capacity, createdAt, updatedAt, deletedAt
) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567801', @tt_cs101, 'd1b2c3d4-e5f6-7890-abcd-ef1234567801', 'BLOCK-A', 30, @now, @now, NULL),
('a1b2c3d4-e5f6-7890-abcd-ef1234567802', @tt_cs101, 'd1b2c3d4-e5f6-7890-abcd-ef1234567802', 'BLOCK-B', 30, @now, @now, NULL);
