-- ============================================================
-- Disable FK checks and truncate tables
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE user_auth_token;
TRUNCATE TABLE users;
TRUNCATE TABLE user_types;
TRUNCATE TABLE faculty;
TRUNCATE TABLE faculty_type;
TRUNCATE TABLE students;
TRUNCATE TABLE student_personaldetails;
TRUNCATE TABLE student_parentdetail;
TRUNCATE TABLE student_add;
TRUNCATE TABLE student_doc_link;
TRUNCATE TABLE category_master;
TRUNCATE TABLE seat_type_master;
TRUNCATE TABLE gender_master;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- STEP 1: Masters (Base requirements)
-- ============================================================
INSERT INTO user_types (utid, base, createdAt, updatedAt) VALUES
(0, 'SuperAdmin', NOW(), NOW()),
(1, 'Admin', NOW(), NOW()),
(2, 'Faculty', NOW(), NOW()),
(3, 'Student', NOW(), NOW()),
(4, 'Staff', NOW(), NOW()),
(5, 'Alumni', NOW(), NOW());

INSERT INTO gender_master (gender_id, gender_name) VALUES
(1, 'Male'),
(2, 'Female'),
(3, 'Other');

INSERT INTO faculty_type (ftype_id, type_name, createdAt, updatedAt) VALUES
('37261930-decd-44b4-8846-668c13ba71ec', 'Permanent', NOW(), NOW()),
('4f48833f-40bc-4ccb-bd6a-8c2983ce4c3d', 'Visiting', NOW(), NOW()),
('145e8ab1-170e-450e-9172-309eecb5fa91', 'Adjunct', NOW(), NOW()),
('5efb8b1c-d66c-44a1-ab8d-745f016cef83', 'Contractual', NOW(), NOW()),
('3ab825c4-ee8a-42dc-8e09-3031c6689e3b', 'Guest', NOW(), NOW());

INSERT INTO category_master (cat_id, cat_name) VALUES
(1, 'Open'),
(2, 'OBC'),
(3, 'SC'),
(4, 'ST'),
(5, 'EWS');

INSERT INTO seat_type_master (seat_type_id, seat_type_name) VALUES
(1, 'Merit'),
(2, 'Management'),
(3, 'NRI'),
(4, 'Sports Quota'),
(5, 'PWD');

-- ============================================================
-- STEP 2: Users
-- ============================================================
INSERT INTO users (uid, email, password, user_type, faculty_id, student_id, is_active, createdAt, updatedAt) VALUES
('e4d1f2b6-9a2c-4b5f-8c3d-1e2f3a4b5c6d', 'superadmin@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 0, NULL, NULL, 1, NOW(), NOW()),
('4739f88f-fec7-4aa9-92b1-4636d62a828d', 'admin@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 1, NULL, NULL, 1, NOW(), NOW()),
('88c92688-5432-4243-8275-24afb55d5d13', 'fac1@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 2, '9e4d3e69-e754-45dc-bdd2-075694b156a2', NULL, 1, NOW(), NOW()),
('797feeae-08c4-4b97-953a-98d032ee9c16', 'fac2@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 2, '7adfeea9-fe6e-4046-8b27-76db91ebed34', NULL, 1, NOW(), NOW()),
('4d72205b-9399-4053-bad6-fc84a7562630', 'fac3@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 2, '23f09f6e-5567-4e83-b144-e8e89aec6262', NULL, 1, NOW(), NOW()),
('27e73ce3-73f9-4641-8a00-15fed3c3b187', 'fac4@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 2, '5ab6aa90-ddc8-4749-a325-c8f58ea5d9ac', NULL, 1, NOW(), NOW()),
('1e3116a3-ba2a-44aa-ab1b-7137a4b09b02', 'fac5@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 2, '40040014-f127-4d37-82e1-9da3d1b6f83b', NULL, 1, NOW(), NOW()),
('3d7e5c82-58fa-4f0a-9d8f-4b51b6ce06d5', 'std1@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 3, NULL, '57ba62ff-3e61-4384-b940-4dfdd92da14e', 1, NOW(), NOW()),
('9c4d1537-4667-4273-bda2-9bd3c75b79cb', 'std2@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 3, NULL, '349c7406-bddf-490e-b8f6-f9f20cae04fc', 1, NOW(), NOW()),
('483dcff0-95d7-419b-8887-319d500c54a0', 'std3@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 3, NULL, 'a3142a9b-8d2e-4805-a389-4d58d13c0095', 1, NOW(), NOW()),
('aeb0c5f9-7f5b-4dd0-88b3-26d4b9cd945f', 'std4@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 3, NULL, 'a5401d0c-2aba-4055-b178-07708e24a4f3', 1, NOW(), NOW()),
('438994ff-4ad7-4f44-b5a1-f0dea428ef39', 'std5@ems.com', '$2b$12$QW9aqQmo22vaearLHWchNudNquHhXYrVIv7KRz9iFww3QFBMUEAyG', 3, NULL, '719ca0e7-05af-4518-be0b-8a84a640e93e', 1, NOW(), NOW());

-- ============================================================
-- STEP 3: Faculty
-- ============================================================
INSERT INTO faculty (faculty_id, uid, faculty_clg_id, name, contact, ftype_id, depart_id, branch_id, role, joining_date, gender, dob, qualification, email, status, createdAt, updatedAt) VALUES
('9e4d3e69-e754-45dc-bdd2-075694b156a2', '88c92688-5432-4243-8275-24afb55d5d13', 'FAC001', 'Dr. John Doe', '9000000001', '37261930-decd-44b4-8846-668c13ba71ec', 'd1ec5f8c-5d51-4b27-9ada-04dd2144cd1e', 'c5b1d68c-e3b1-444b-b2e5-33e70e72a837', 'Professor', '2020-01-01', 'Male', '1980-05-15', 'PhD in CS', 'fac1@ems.com', 1, NOW(), NOW()),
('7adfeea9-fe6e-4046-8b27-76db91ebed34', '797feeae-08c4-4b97-953a-98d032ee9c16', 'FAC002', 'Dr. Jane Smith', '9000000002', '37261930-decd-44b4-8846-668c13ba71ec', 'c1ea8b19-f138-4f6f-a99a-dcc35ece6e53', '0ca57729-0cc3-4755-b749-8193b560827c', 'Assoc. Prof', '2019-06-12', 'Female', '1982-08-20', 'PhD in AI', 'fac2@ems.com', 1, NOW(), NOW()),
('23f09f6e-5567-4e83-b144-e8e89aec6262', '4d72205b-9399-4053-bad6-fc84a7562630', 'FAC003', 'Prof. Alan Turing', '9000000003', '4f48833f-40bc-4ccb-bd6a-8c2983ce4c3d', 'b7e87a81-f53e-4a01-ab16-85b93a1190a9', 'be6f6973-9cce-4cc1-9a56-f8e7cac20194', 'Asst. Prof', '2021-02-10', 'Male', '1985-11-05', 'MTech DS', 'fac3@ems.com', 1, NOW(), NOW()),
('5ab6aa90-ddc8-4749-a325-c8f58ea5d9ac', '27e73ce3-73f9-4641-8a00-15fed3c3b187', 'FAC004', 'Dr. Sarah Connor', '9000000004', '37261930-decd-44b4-8846-668c13ba71ec', 'ab6c1b16-2389-4efc-bdfb-3eb9c096c586', '891fef28-7ee7-46fe-9615-bd393b9546c5', 'HOD', '2015-08-01', 'Female', '1975-03-30', 'PhD Mech', 'fac4@ems.com', 1, NOW(), NOW()),
('40040014-f127-4d37-82e1-9da3d1b6f83b', '1e3116a3-ba2a-44aa-ab1b-7137a4b09b02', 'FAC005', 'Dr. Bruce Wayne', '9000000005', '145e8ab1-170e-450e-9172-309eecb5fa91', '9c2a3121-d1f2-48a3-96fa-36ad46591b42', '729073f1-6521-4455-9234-df536c6c900b', 'Guest Lec', '2022-01-15', 'Male', '1988-12-12', 'MSc Auto', 'fac5@ems.com', 1, NOW(), NOW());

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
ON DUPLICATE KEY UPDATE updatedAt = NOW();

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
ON DUPLICATE KEY UPDATE role = VALUES(role), signature = VALUES(signature), updatedAt = NOW();

-- ============================================================
-- STEP 4: Student Auxillary Details
-- ============================================================
INSERT INTO student_personaldetails (personal_id, stud_id, first_name, last_name, dob, gender_id, contact, email, createdAt, updatedAt) VALUES
('482c4ed1-1f76-4e00-a7b3-02a9de0768fc', '57ba62ff-3e61-4384-b940-4dfdd92da14e', 'Alice', 'Anderson', '2002-05-10', 2, '8000000001', 'std1@ems.com', NOW(), NOW()),
('851a05b9-e2a2-4381-b01a-64c253bc7dee', '349c7406-bddf-490e-b8f6-f9f20cae04fc', 'Bob', 'Builder', '2001-08-22', 1, '8000000002', 'std2@ems.com', NOW(), NOW()),
('d6577079-3562-4821-81a5-30ca65573514', 'a3142a9b-8d2e-4805-a389-4d58d13c0095', 'Charlie', 'Chaplin', '2003-01-15', 1, '8000000003', 'std3@ems.com', NOW(), NOW()),
('06305b8f-46ff-4957-bf27-0e32add66d80', 'a5401d0c-2aba-4055-b178-07708e24a4f3', 'Diana', 'Prince', '2002-11-30', 2, '8000000004', 'std4@ems.com', NOW(), NOW()),
('da0b7573-6bff-45d4-a1f7-ac3b57cf1333', '719ca0e7-05af-4518-be0b-8a84a640e93e', 'Eve', 'Polastri', '2001-12-05', 2, '8000000005', 'std5@ems.com', NOW(), NOW());

INSERT INTO student_parentdetail (parent_id, fullname, contact, email, createdAt, updatedAt) VALUES
('515d80cd-ef1d-4e58-ba80-05eb043f8f7e', 'Arthur Anderson', '7000000001', 'father1@example.com', NOW(), NOW()),
('3cbb92db-93d3-4f8e-aa5d-4d2bd8780f0c', 'Amy Anderson', '6000000001', 'mother1@example.com', NOW(), NOW()),
('2a439fcd-0298-454a-b79a-99fda1cff08e', 'Guard Anderson', '7000001001', 'guard1@example.com', NOW(), NOW()),
('3a53ad01-9d90-4aaa-b80a-53c0a8fc3509', 'Bill Builder', '7000000002', 'father2@example.com', NOW(), NOW()),
('1272d861-dcce-4f4e-9473-817721679326', 'Betty Builder', '6000000002', 'mother2@example.com', NOW(), NOW());

INSERT INTO student_add (sadd_id, address, city, state, pincode, createdAt, updatedAt) VALUES
('93d05e6c-7d4d-45d1-ad66-e5e4a738a9e7', '123 Street A', 'City X', 'State Y', '400001', NOW(), NOW()),
('50f15359-860c-4123-a28f-f5777e6288ea', '456 Street B', 'City Z', 'State Y', '400002', NOW(), NOW()),
('65d9be50-823e-49a0-b6c9-67a34f27e56d', '789 Street C', 'City X', 'State W', '400003', NOW(), NOW()),
('d3db318e-7249-49d0-b585-f6905474a00e', '101 Street D', 'City V', 'State Z', '400004', NOW(), NOW()),
('afa4794e-91c0-4dce-bc83-e13df65c728f', '202 Street E', 'City U', 'State W', '400005', NOW(), NOW());

INSERT INTO student_doc_link (doc_id, createdAt, updatedAt) VALUES
('b8ed5f1c-0cb6-4f26-a52c-692181dfeb28', NOW(), NOW()),
('38a45325-1047-4b60-ab09-527b52d81144', NOW(), NOW()),
('52928c3f-da7d-47b5-b594-de96e9738528', NOW(), NOW()),
('f2eeda70-0e4f-41a2-998d-91eb75a4e60b', NOW(), NOW()),
('76e5a313-3fcc-4749-a580-96fd36cd2d0c', NOW(), NOW());

-- ============================================================
-- STEP 5: Students
-- ============================================================
INSERT INTO students (sid, stud_clg_id, uid, program_id, cat_id, seat_type_id, branch_id, personal_details_id, father_id, mother_id, guardian_id, doc_ids, academic_year, dd_id, neft_id, RowNum, createdAt, updatedAt) VALUES
('57ba62ff-3e61-4384-b940-4dfdd92da14e', 'STU001', '3d7e5c82-58fa-4f0a-9d8f-4b51b6ce06d5', '414a81f2-4596-415d-84d4-b918891acd66', '1', '1', 'c5b1d68c-e3b1-444b-b2e5-33e70e72a837', '482c4ed1-1f76-4e00-a7b3-02a9de0768fc', '515d80cd-ef1d-4e58-ba80-05eb043f8f7e', '3cbb92db-93d3-4f8e-aa5d-4d2bd8780f0c', '2a439fcd-0298-454a-b79a-99fda1cff08e', 'b8ed5f1c-0cb6-4f26-a52c-692181dfeb28', '2024-25', '243ec3c3-b798-4a1d-b9f3-c4723e219118', '1da3178f-4dba-409b-84f8-44c4a873cee3', 1, NOW(), NOW()),
('349c7406-bddf-490e-b8f6-f9f20cae04fc', 'STU002', '9c4d1537-4667-4273-bda2-9bd3c75b79cb', 'c273adf3-d5cf-4c41-9ea5-bbc1e1ab142a', '2', '2', '0ca57729-0cc3-4755-b749-8193b560827c', '851a05b9-e2a2-4381-b01a-64c253bc7dee', '3a53ad01-9d90-4aaa-b80a-53c0a8fc3509', '1272d861-dcce-4f4e-9473-817721679326', '2a439fcd-0298-454a-b79a-99fda1cff08e', '38a45325-1047-4b60-ab09-527b52d81144', '2024-25', 'ce89674e-a44d-476d-bb01-aa9328fb97d5', 'daa599dc-2ccc-496a-ac2f-3a47ee53abb0', 2, NOW(), NOW()),
('a3142a9b-8d2e-4805-a389-4d58d13c0095', 'STU003', '483dcff0-95d7-419b-8887-319d500c54a0', '39a3076a-ac84-49e0-8251-339be935dd9d', '1', '1', 'be6f6973-9cce-4cc1-9a56-f8e7cac20194', 'd6577079-3562-4821-81a5-30ca65573514', '515d80cd-ef1d-4e58-ba80-05eb043f8f7e', '3cbb92db-93d3-4f8e-aa5d-4d2bd8780f0c', '2a439fcd-0298-454a-b79a-99fda1cff08e', '52928c3f-da7d-47b5-b594-de96e9738528', '2024-25', '68d5e519-2f63-480f-80dc-05a4083ec819', '2426cd10-148f-48da-bbeb-292c4f9f03c7', 3, NOW(), NOW()),
('a5401d0c-2aba-4055-b178-07708e24a4f3', 'STU004', 'aeb0c5f9-7f5b-4dd0-88b3-26d4b9cd945f', 'bb6808ad-e6af-4aef-bbbd-c50ab9835844', '3', '3', '891fef28-7ee7-46fe-9615-bd393b9546c5', '06305b8f-46ff-4957-bf27-0e32add66d80', '3a53ad01-9d90-4aaa-b80a-53c0a8fc3509', '1272d861-dcce-4f4e-9473-817721679326', '2a439fcd-0298-454a-b79a-99fda1cff08e', 'f2eeda70-0e4f-41a2-998d-91eb75a4e60b', '2024-25', 'e5586d32-851f-4f10-8998-ec6801b47d96', '64ecbfb4-c32a-4118-b65c-e65820deff08', 4, NOW(), NOW()),
('719ca0e7-05af-4518-be0b-8a84a640e93e', 'STU005', '438994ff-4ad7-4f44-b5a1-f0dea428ef39', '54c91a3e-b9f1-458a-ab83-5c921e61b0df', '4', '1', '729073f1-6521-4455-9234-df536c6c900b', 'da0b7573-6bff-45d4-a1f7-ac3b57cf1333', '515d80cd-ef1d-4e58-ba80-05eb043f8f7e', '3cbb92db-93d3-4f8e-aa5d-4d2bd8780f0c', '2a439fcd-0298-454a-b79a-99fda1cff08e', '76e5a313-3fcc-4749-a580-96fd36cd2d0c', '2024-25', '2865b484-25ac-4ef0-a477-27a4a10f895f', 'ec7b87fa-50c3-4df8-a255-848b74234337', 5, NOW(), NOW());

-- ============================================================
-- STEP 6: Hall ticket permissions (Student role utid = 3)
-- ============================================================
INSERT INTO permissions (id, module, action, code) VALUES
('perm1111-1111-4111-8111-111111111111', 'hall_ticket', 'view', 'hall_ticket:view'),
('perm2222-2222-4222-8222-222222222222', 'hall_ticket', 'download', 'hall_ticket:download')
ON DUPLICATE KEY UPDATE module = VALUES(module), action = VALUES(action), code = VALUES(code);

INSERT INTO role_permissions (id, utid, permission_id) VALUES
('rp111111-1111-4111-8111-111111111111', 3, 'perm1111-1111-4111-8111-111111111111'),
('rp222222-2222-4222-8222-222222222222', 3, 'perm2222-2222-4222-8222-222222222222')
ON DUPLICATE KEY UPDATE utid = VALUES(utid), permission_id = VALUES(permission_id);

-- ============================================================
-- STEP 7: User Auth Token 
-- ============================================================
INSERT INTO user_auth_token (auth_id, uid, token, token_hash, expires_at, user_type, login_time, createdAt, updatedAt) VALUES
('cc6b251d-a56a-4a58-a163-58a461773b85', '88c92688-5432-4243-8275-24afb55d5d13', 'Bearer rToken1', 'hash1', '2025-12-31 23:59:59', '2', NOW(), NOW(), NOW()),
('ffe71d63-a4f7-4ed6-83e0-4083d2eae7a4', '797feeae-08c4-4b97-953a-98d032ee9c16', 'Bearer rToken2', 'hash2', '2025-12-31 23:59:59', '2', NOW(), NOW(), NOW()),
('9a7fd1b7-ac63-4be5-b575-d2ff03b80249', '3d7e5c82-58fa-4f0a-9d8f-4b51b6ce06d5', 'Bearer rToken3', 'hash3', '2025-12-31 23:59:59', '3', NOW(), NOW(), NOW()),
('cd4fe3a5-dad1-4d1f-861d-e82c89be6b90', '9c4d1537-4667-4273-bda2-9bd3c75b79cb', 'Bearer rToken4', 'hash4', '2025-12-31 23:59:59', '3', NOW(), NOW(), NOW()),
('0d07c67f-5f95-4408-a7fc-092db21ce66d', '483dcff0-95d7-419b-8887-319d500c54a0', 'Bearer rToken5', 'hash5', '2025-12-31 23:59:59', '3', NOW(), NOW(), NOW());