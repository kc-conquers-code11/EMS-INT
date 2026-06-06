-- Exam registrations: Summer 2026 (hall ticket) + Jury (payment/timetable). Idempotent upserts.
SOURCE seed_constants.sql;

INSERT INTO exam_registration (
  exam_reg_id, sid, event_id, reg_type, reg_status, registered_at,
  approved_at, fee_amount, payment_status, payment_date, hall_ticket_hold_override,
  createdAt, updatedAt
) VALUES
(@reg_alice_summer, @stu_alice, @event_summer_2026, 'regular', 'confirmed', @now, @now, 1500.00, 'completed', @now, 0, @now, @now),
(@reg_bob_summer, @stu_bob, @event_summer_2026, 'regular', 'confirmed', @now, @now, 1500.00, 'completed', @now, 0, @now, @now),
(@reg_carol_summer, @stu_carol, @event_summer_2026, 'regular', 'confirmed', @now, NULL, 1500.00, 'pending', NULL, 0, @now, @now),
(@reg_david_summer, @stu_david, @event_summer_2026, 'regular', 'confirmed', @now, @now, 1500.00, 'completed', @now, 0, @now, @now),
(@reg_eva_summer, @stu_eva, @event_summer_2026, 'backlog', 'confirmed', @now, NULL, 1500.00, 'completed', @now, 0, @now, @now),
(@reg_alice_jury, @stu_alice, @event_jury, 'regular', 'confirmed', @now, NULL, 2000.00, 'pending', NULL, 0, @now, @now)
ON DUPLICATE KEY UPDATE
  sid = VALUES(sid),
  event_id = VALUES(event_id),
  reg_status = VALUES(reg_status),
  payment_status = VALUES(payment_status),
  approved_at = VALUES(approved_at),
  payment_date = VALUES(payment_date),
  hall_ticket_hold_override = VALUES(hall_ticket_hold_override),
  updatedAt = @now;

-- Re-home legacy rows that were tied to the jury event before Summer 2026 was split out
UPDATE exam_registration
SET event_id = @event_summer_2026, updatedAt = @now
WHERE exam_reg_id IN (
  @reg_bob_summer, @reg_carol_summer, @reg_david_summer, @reg_eva_summer
) AND event_id <> @event_summer_2026;
