-- Principal faculty + signature for hall ticket PDFs (idempotent)
-- Run after ems_admin_seed.sql and programme seed (Sunrise CE dept/branch)

INSERT INTO users (uid, email, password, user_type, faculty_id, student_id, is_active, createdAt, updatedAt)
VALUES (
  'a1111111-1111-4111-8111-111111111111',
  'principal@sunrise.edu',
  '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG',
  2,
  'a1111111-1111-4111-8111-111111111112',
  NULL,
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE email = VALUES(email), updatedAt = NOW();

INSERT INTO faculty (
  faculty_id, uid, faculty_clg_id, name, contact, ftype_id, depart_id, branch_id,
  role, joining_date, gender, email, signature, status, createdAt, updatedAt
) VALUES (
  'a1111111-1111-4111-8111-111111111112',
  'a1111111-1111-4111-8111-111111111111',
  'PRIN001',
  'Dr. Krrish Principal',
  '9000000099',
  '37261930-decd-44b4-8846-668c13ba71ec',
  'c41ad7c3-1446-4974-9f9a-851d784eaa67',
  '745df7c3-b302-4069-94f8-6edb71877422',
  'Principal',
  '2010-01-01',
  'Male',
  'principal@sunrise.edu',
  '/uploads/faculty/principal/sign.png',
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  role = VALUES(role),
  signature = VALUES(signature),
  name = VALUES(name),
  updatedAt = NOW();
