-- Fee transactions for Jury event (uses admin STU002/STU003 + Alice). Does not truncate exam_registration.
SOURCE seed_constants.sql;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE fee_transaction;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO exam_registration (exam_reg_id, sid, event_id, reg_type, reg_status, registered_at, createdAt, updatedAt)
VALUES
(@reg_alice_jury, @stu_alice, @event_jury, 'regular', 'confirmed', @now, @now, @now),
('f7c32e14-72eb-4752-9b0d-0346c7dc2d6a', '349c7406-bddf-490e-b8f6-f9f20cae04fc', @event_jury, 'regular', 'confirmed', @now, @now, @now),
('2481fcce-8c5e-49b0-9dbb-8b5eec0edc7e', 'a3142a9b-8d2e-4805-a389-4d58d13c0095', @event_jury, 'regular', 'confirmed', @now, @now, @now),
('ddb9b398-38cd-40a2-afbd-3cbf130c14b7', 'a5401d0c-2aba-4055-b178-07708e24a4f3', @event_backlog, 'backlog', 'confirmed', @now, @now, @now),
('6c34bc1a-6f0a-4a27-a006-25f38a53ea3f', '719ca0e7-05af-4518-be0b-8a84a640e93e', @event_backlog, 'backlog', 'failed', @now, @now, @now)
ON DUPLICATE KEY UPDATE reg_status = VALUES(reg_status), updatedAt = @now;

INSERT INTO fee_transaction (
  txn_id, exam_reg_id, amount, payment_mode, txn_reference, txn_status,
  razorpay_order_id, razorpay_payment_id, razorpay_signature, paid_at, createdAt, updatedAt
) VALUES
('b0fbb48c-7956-444f-a9db-8dcf8c04eab2', @reg_alice_jury, 2000.00, 'razorpay', 'REF100001', 'success', 'order_M1xP8G6wQ', 'pay_M1xP8H6wQ', 'sig_abcdef0123456789', @now, @now, @now),
('54bdcd8a-0cc7-44bc-b16a-68a867b36f75', 'f7c32e14-72eb-4752-9b0d-0346c7dc2d6a', 2000.00, 'razorpay', 'REF100002', 'success', 'order_L2xP9G7wR', 'pay_L2xP9H8wS', 'sig_abcdef1234567890', @now, @now, @now),
('f43b567a-bbcd-4b1a-8cbb-d3ef6a751bc2', '2481fcce-8c5e-49b0-9dbb-8b5eec0edc7e', 2000.00, 'razorpay', 'REF100003', 'success', 'order_K3xP0G8wS', 'pay_K3xP1H9wT', 'sig_1234567890abcdef', @now, @now, @now),
('b6d1eb2d-0b17-4ef8-b216-2bc5d6a2fba8', 'ddb9b398-38cd-40a2-afbd-3cbf130c14b7', 450.00, 'razorpay', 'REF100004', 'success', 'order_J4xP1G9wT', 'pay_J4xP2H0wU', 'sig_0987654321fedcba', @now, @now, @now),
('a8a0bc7a-5dbf-4712-a72e-063a8a0f58db', '6c34bc1a-6f0a-4a27-a006-25f38a53ea3f', 450.00, 'razorpay', 'REF100005', 'failed', 'order_H5xP2G0wU', NULL, NULL, NULL, @now, @now);

UPDATE exam_registration er
INNER JOIN fee_transaction ft ON ft.exam_reg_id = er.exam_reg_id AND ft.txn_status = 'success'
SET er.payment_status = 'completed', er.payment_date = @now, er.fee_amount = ft.amount, er.updatedAt = @now;
