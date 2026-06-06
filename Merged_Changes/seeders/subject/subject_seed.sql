-- ============================================================
-- Disable FK checks and truncate/recreate tables
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `subject`;
TRUNCATE TABLE `scheme`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- STEP 1: Seed Scheme (At least 1 active scheme)
-- ============================================================
INSERT INTO scheme 
  (scheme_id, programm_id, scheme_name, scheme_year, description, status, created_at, updatedAt)
VALUES
  ('0ca2e362-bd04-4c1e-81b5-07bb48df9385', 'b8f62072-4115-4978-9de6-3272308a4f59', 'Computer Engineering Scheme 2024', 2024, 'Computer Engineering Syllabus Scheme', 'active', NOW(), NOW());

-- ============================================================
-- STEP 2: Seed Subjects (At least 2 different subject types)
-- ============================================================
INSERT INTO subject 
  (subject_id, scheme_id, subject_code, subject_name, subject_type, credits, max_theory, max_practical, max_oral, max_tw, min_pass_theory, min_pass_practical, exam_duration_min, status, branch_id, sem, acad_year, createdAt, updatedAt)
VALUES
  ('7781e34d-cb17-41ba-99ba-b4b9eb8d875e', '0ca2e362-bd04-4c1e-81b5-07bb48df9385', 'CS101', 'Introduction to Computer Science', 'Theory', 3, 100, 0, 0, 0, 40, 0, 180, 1, NULL, 1, '2024-25', NOW(), NOW()),
  ('c089e0dc-9344-45c3-8050-6ebfcb0a4802', '0ca2e362-bd04-4c1e-81b5-07bb48df9385', 'CS101P', 'Introduction to Computer Science Practical', 'Practical', 1, 0, 50, 0, 0, 0, 20, 120, 1, NULL, 1, '2024-25', NOW(), NOW());
