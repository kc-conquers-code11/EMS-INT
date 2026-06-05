-- ============================================================
-- Disable FK checks so we can truncate freely
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE branch;
TRUNCATE TABLE programme;
TRUNCATE TABLE department;
TRUNCATE TABLE institution;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- STEP 1: institution
-- ============================================================
INSERT INTO institution
  (institution_id, name, address, logo, institution_type, affiliated_university, contact, email, website, status, createdAt, updatedAt)
VALUES
  ('4739f88f-fec7-4aa9-92b1-4636d62a828d', 'Sunrise Engineering College', 'Address 1, Tech Park, City', NULL, 'Generic', 'University 1', '9876543200', 'inst1@example.com', 'https://inst1.example.com', 1, NOW(), NOW()),
  ('85d43ed9-d347-4546-b051-6f929b016e79', 'Horizon Medical Institute', 'Address 2, Tech Park, City', NULL, 'Generic', 'University 2', '9876543201', 'inst2@example.com', 'https://inst2.example.com', 1, NOW(), NOW()),
  ('2f892b2e-367b-4a4d-90a2-9a9ea29f5889', 'Apex Arts & Commerce College', 'Address 3, Tech Park, City', NULL, 'Generic', 'University 3', '9876543202', 'inst3@example.com', 'https://inst3.example.com', 1, NOW(), NOW()),
  ('eb545767-62ec-4c16-9484-e200e5a6dc15', 'Global Institute of Technology', 'Address 4, Tech Park, City', NULL, 'Generic', 'University 4', '9876543203', 'inst4@example.com', 'https://inst4.example.com', 1, NOW(), NOW()),
  ('a47515e8-bc06-4de0-938a-e7037e1674eb', 'National Science Academy', 'Address 5, Tech Park, City', NULL, 'Generic', 'University 5', '9876543204', 'inst5@example.com', 'https://inst5.example.com', 1, NOW(), NOW()),
  ('93bad8e8-5419-40bb-b39f-92bd33f712e1', 'Pioneer Business School', 'Address 6, Tech Park, City', NULL, 'Generic', 'University 6', '9876543205', 'inst6@example.com', 'https://inst6.example.com', 1, NOW(), NOW()),
  ('23f030c6-2eef-4982-b538-e6ec1fe33ee2', 'Crescent Law College', 'Address 7, Tech Park, City', NULL, 'Generic', 'University 7', '9876543206', 'inst7@example.com', 'https://inst7.example.com', 1, NOW(), NOW()),
  ('e7a9bfed-f74a-4fdf-b08e-d7bc4a580443', 'Elite Design Institute', 'Address 8, Tech Park, City', NULL, 'Generic', 'University 8', '9876543207', 'inst8@example.com', 'https://inst8.example.com', 1, NOW(), NOW()),
  ('4e830c34-c2eb-4222-92b7-3336a6e320ee', 'Summit College of Pharmacy', 'Address 9, Tech Park, City', NULL, 'Generic', 'University 9', '9876543208', 'inst9@example.com', 'https://inst9.example.com', 1, NOW(), NOW()),
  ('2fc04b77-04aa-4448-ba27-84a75568939f', 'Zenith Architecture School', 'Address 10, Tech Park, City', NULL, 'Generic', 'University 10', '9876543209', 'inst10@example.com', 'https://inst10.example.com', 1, NOW(), NOW()),
  ('87be5171-d1c8-4f63-aeaa-55fefdf1d99b', 'Meridian College of Nursing', 'Address 11, Tech Park, City', NULL, 'Generic', 'University 11', '9876543210', 'inst11@example.com', 'https://inst11.example.com', 1, NOW(), NOW()),
  ('361e8b07-b139-4bab-ba00-f4d224755658', 'Paramount College of Education', 'Address 12, Tech Park, City', NULL, 'Generic', 'University 12', '9876543211', 'inst12@example.com', 'https://inst12.example.com', 1, NOW(), NOW()),
  ('402f07de-5bd5-4d6d-b78f-e89ede205191', 'Beacon Agricultural University', 'Address 13, Tech Park, City', NULL, 'Generic', 'University 13', '9876543212', 'inst13@example.com', 'https://inst13.example.com', 1, NOW(), NOW()),
  ('69ad2dbe-215a-47c4-a736-2314c12c0a7b', 'Vertex College of Fine Arts', 'Address 14, Tech Park, City', NULL, 'Generic', 'University 14', '9876543213', 'inst14@example.com', 'https://inst14.example.com', 1, NOW(), NOW()),
  ('a8e7460b-547d-489c-a16e-bba351d7a300', 'Olympus Sports Academy', 'Address 15, Tech Park, City', NULL, 'Generic', 'University 15', '9876543214', 'inst15@example.com', 'https://inst15.example.com', 1, NOW(), NOW()),
  ('ac1757b6-fd32-4724-b8cb-d8c5e950d7b8', 'Nexus Institute of Media', 'Address 16, Tech Park, City', NULL, 'Generic', 'University 16', '9876543215', 'inst16@example.com', 'https://inst16.example.com', 1, NOW(), NOW()),
  ('ce480a4e-1f81-4103-98aa-8ef05df673de', 'Aura College of Hotel Management', 'Address 17, Tech Park, City', NULL, 'Generic', 'University 17', '9876543216', 'inst17@example.com', 'https://inst17.example.com', 1, NOW(), NOW()),
  ('ebd6f404-2bf1-4fba-890e-f553400cf5fe', 'Prime Institute of Fashion', 'Address 18, Tech Park, City', NULL, 'Generic', 'University 18', '9876543217', 'inst18@example.com', 'https://inst18.example.com', 1, NOW(), NOW()),
  ('6d56564e-0429-4d74-a1a5-b10a2119e292', 'Stellar Aviation Academy', 'Address 19, Tech Park, City', NULL, 'Generic', 'University 19', '9876543218', 'inst19@example.com', 'https://inst19.example.com', 1, NOW(), NOW()),
  ('47f83354-e694-43e4-9b88-f4fc3bf9322a', 'Quantum Institute of Research', 'Address 20, Tech Park, City', NULL, 'Generic', 'University 20', '9876543219', 'inst20@example.com', 'https://inst20.example.com', 1, NOW(), NOW());

-- ============================================================
-- STEP 2: department
-- ============================================================
INSERT INTO department
  (depart_id, institution_id, depart_name, depart_code, hod_faculty_id, status)
VALUES
  ('c41ad7c3-1446-4974-9f9a-851d784eaa67', '4739f88f-fec7-4aa9-92b1-4636d62a828d', 'Computer Engineering', 'CE', NULL, 1),
  ('2849e3f6-b36d-40dc-ba1b-044ad6d75587', '85d43ed9-d347-4546-b051-6f929b016e79', 'Mechanical Engineering', 'ME', NULL, 1),
  ('aa6da51a-067d-478c-9093-3356eae5c743', '2f892b2e-367b-4a4d-90a2-9a9ea29f5889', 'Electronics & Telecomm', 'EXTC', NULL, 1),
  ('f1745543-89ac-4a7a-9806-9b3a400043c0', 'eb545767-62ec-4c16-9484-e200e5a6dc15', 'General Medicine', 'GM', NULL, 1),
  ('2baa51dc-92c4-4bef-9fd6-cb62221a05de', 'a47515e8-bc06-4de0-938a-e7037e1674eb', 'Pharmacy', 'PH', NULL, 1),
  ('b964fa32-6130-4026-b1c6-9939a954f2c5', '93bad8e8-5419-40bb-b39f-92bd33f712e1', 'Commerce', 'COM', NULL, 1),
  ('75633b6e-d488-4346-9fbe-d10e3e7738bb', '23f030c6-2eef-4982-b538-e6ec1fe33ee2', 'Arts & Humanities', 'AH', NULL, 1),
  ('6846ade4-288d-4517-a35d-6f25aa8c57ed', 'e7a9bfed-f74a-4fdf-b08e-d7bc4a580443', 'Information Technology', 'IT', NULL, 1),
  ('5e9faa8c-6f23-485f-9c08-d01ec04a7597', '4e830c34-c2eb-4222-92b7-3336a6e320ee', 'Civil Engineering', 'CIVIL', NULL, 1),
  ('18628dcb-91b2-4165-9538-fcd30bfc91fe', '2fc04b77-04aa-4448-ba27-84a75568939f', 'Business Administration', 'BBA', NULL, 1),
  ('f7a9cf6d-4c0d-4da8-bd4e-a548af139903', '87be5171-d1c8-4f63-aeaa-55fefdf1d99b', 'Law', 'LAW', NULL, 1),
  ('8c10fe6a-9ba0-4cc1-995a-a92071898e2a', '361e8b07-b139-4bab-ba00-f4d224755658', 'Design', 'DES', NULL, 1),
  ('2030de02-45cb-4b4e-aea9-20c32b8641be', '402f07de-5bd5-4d6d-b78f-e89ede205191', 'Architecture', 'ARCH', NULL, 1),
  ('5edfe750-e3f2-41cb-a992-b1720bd4bf37', '69ad2dbe-215a-47c4-a736-2314c12c0a7b', 'Nursing', 'NUR', NULL, 1),
  ('0ce9913c-8469-4bc0-9473-13cd26967ce0', 'a8e7460b-547d-489c-a16e-bba351d7a300', 'Education', 'EDU', NULL, 1),
  ('18e5571f-1321-4c9a-a1eb-b5102ea271db', 'ac1757b6-fd32-4724-b8cb-d8c5e950d7b8', 'Agriculture', 'AGRI', NULL, 1),
  ('7efcb309-3635-4008-b638-98551ad2f210', 'ce480a4e-1f81-4103-98aa-8ef05df673de', 'Fine Arts', 'FA', NULL, 1),
  ('d865071e-8b46-4298-91f8-5659ff518777', 'ebd6f404-2bf1-4fba-890e-f553400cf5fe', 'Sports Management', 'SM', NULL, 1),
  ('922d2f27-ceab-4fb0-a8e7-100f55c9d053', '6d56564e-0429-4d74-a1a5-b10a2119e292', 'Media Studies', 'MS', NULL, 1),
  ('8b246f0e-1dfa-4691-83c2-5655a34b067d', '47f83354-e694-43e4-9b88-f4fc3bf9322a', 'Hotel Management', 'HM', NULL, 1);

-- ============================================================
-- STEP 3: programme
-- ============================================================
INSERT INTO programme
  (programm_id, institution_id, depart_id, programme_name, programme_code, degree_type, duration_years, total_semesters, approved_intake, status, createdAt, updatedAt)
VALUES
  ('b8f62072-4115-4978-9de6-3272308a4f59', '4739f88f-fec7-4aa9-92b1-4636d62a828d', 'c41ad7c3-1446-4974-9f9a-851d784eaa67', 'Bachelor of Engineering - Computer', 'BE-CE', 'UG', 4, 8, 125, 1, NOW(), NOW()),
  ('6610bacd-4d78-4206-9542-2bfed77acba8', '85d43ed9-d347-4546-b051-6f929b016e79', '2849e3f6-b36d-40dc-ba1b-044ad6d75587', 'Bachelor of Engineering - Mechanical', 'BE-ME', 'UG', 4, 8, 74, 1, NOW(), NOW()),
  ('765a1489-1f79-46ff-afcb-39e12de112d7', '2f892b2e-367b-4a4d-90a2-9a9ea29f5889', 'aa6da51a-067d-478c-9093-3356eae5c743', 'Bachelor of Engineering - EXTC', 'BE-EXTC', 'UG', 4, 8, 111, 1, NOW(), NOW()),
  ('2dc22bf6-5faa-4b89-8a62-2d62862adc2b', 'eb545767-62ec-4c16-9484-e200e5a6dc15', 'f1745543-89ac-4a7a-9806-9b3a400043c0', 'Master of Engineering - Computer', 'ME-CE', 'PG', 2, 4, 71, 1, NOW(), NOW()),
  ('ad31e11f-495c-4216-809b-545cd995b55e', 'a47515e8-bc06-4de0-938a-e7037e1674eb', '2baa51dc-92c4-4bef-9fd6-cb62221a05de', 'Bachelor of Medicine & Surgery', 'MBBS', 'UG', 5, 10, 102, 1, NOW(), NOW()),
  ('25bd0f9b-6aac-4b3e-bae1-749614489e47', '93bad8e8-5419-40bb-b39f-92bd33f712e1', 'b964fa32-6130-4026-b1c6-9939a954f2c5', 'Bachelor of Pharmacy', 'B.Pharm', 'UG', 4, 8, 102, 1, NOW(), NOW()),
  ('32cd7b36-bc25-4930-9392-dca97a894515', '23f030c6-2eef-4982-b538-e6ec1fe33ee2', '75633b6e-d488-4346-9fbe-d10e3e7738bb', 'Bachelor of Commerce', 'B.Com', 'UG', 3, 6, 118, 1, NOW(), NOW()),
  ('b5dbb1a2-7939-40b9-bfe1-d594ba1170c6', 'e7a9bfed-f74a-4fdf-b08e-d7bc4a580443', '6846ade4-288d-4517-a35d-6f25aa8c57ed', 'Bachelor of Arts', 'BA', 'UG', 3, 6, 68, 1, NOW(), NOW()),
  ('0ace32aa-416e-42c8-b007-cc4f07e62963', '4e830c34-c2eb-4222-92b7-3336a6e320ee', '5e9faa8c-6f23-485f-9c08-d01ec04a7597', 'Bachelor of Technology - IT', 'B.Tech-IT', 'UG', 4, 8, 84, 1, NOW(), NOW()),
  ('65e0e7cd-b54d-4ef4-827d-4dd16e91f6d6', '2fc04b77-04aa-4448-ba27-84a75568939f', '18628dcb-91b2-4165-9538-fcd30bfc91fe', 'Bachelor of Engineering - Civil', 'BE-CIVIL', 'UG', 4, 8, 68, 1, NOW(), NOW()),
  ('d7e629c7-2b16-4d1d-a424-8f820425556f', '87be5171-d1c8-4f63-aeaa-55fefdf1d99b', 'f7a9cf6d-4c0d-4da8-bd4e-a548af139903', 'Bachelor of Business Admin', 'BBA', 'UG', 3, 6, 68, 1, NOW(), NOW()),
  ('0e028462-ef4c-4152-82b9-3c5b660aa733', '361e8b07-b139-4bab-ba00-f4d224755658', '8c10fe6a-9ba0-4cc1-995a-a92071898e2a', 'Bachelor of Laws', 'LLB', 'UG', 3, 6, 85, 1, NOW(), NOW()),
  ('89a36ead-1c05-4f1c-afcd-1dc1b824ce4f', '402f07de-5bd5-4d6d-b78f-e89ede205191', '2030de02-45cb-4b4e-aea9-20c32b8641be', 'Bachelor of Design', 'B.Des', 'UG', 4, 8, 125, 1, NOW(), NOW()),
  ('0df5f26d-a999-4b3c-8c70-fa95ab281f16', '69ad2dbe-215a-47c4-a736-2314c12c0a7b', '5edfe750-e3f2-41cb-a992-b1720bd4bf37', 'Bachelor of Architecture', 'B.Arch', 'UG', 5, 10, 76, 1, NOW(), NOW()),
  ('6988e0f1-74e6-44fb-b43b-c90ef52489cb', 'a8e7460b-547d-489c-a16e-bba351d7a300', '0ce9913c-8469-4bc0-9473-13cd26967ce0', 'Bachelor of Science - Nursing', 'B.Sc-NUR', 'UG', 4, 8, 107, 1, NOW(), NOW()),
  ('b879a418-2011-41dd-9914-80dbcdbe78ea', 'ac1757b6-fd32-4724-b8cb-d8c5e950d7b8', '18e5571f-1321-4c9a-a1eb-b5102ea271db', 'Bachelor of Education', 'B.Ed', 'UG', 2, 4, 78, 1, NOW(), NOW()),
  ('71f456e7-b3a5-40d5-96a2-ccfe8d2645d0', 'ce480a4e-1f81-4103-98aa-8ef05df673de', '7efcb309-3635-4008-b638-98551ad2f210', 'Bachelor of Science - Agriculture', 'B.Sc-AGRI', 'UG', 4, 8, 125, 1, NOW(), NOW()),
  ('5ee379ee-3c51-414b-b264-6b91a14b10bf', 'ebd6f404-2bf1-4fba-890e-f553400cf5fe', 'd865071e-8b46-4298-91f8-5659ff518777', 'Bachelor of Fine Arts', 'BFA', 'UG', 4, 8, 68, 1, NOW(), NOW()),
  ('df6aa607-853b-449d-8639-6e9d3781afed', '6d56564e-0429-4d74-a1a5-b10a2119e292', '922d2f27-ceab-4fb0-a8e7-100f55c9d053', 'Bachelor of Sports Management', 'BSM', 'UG', 3, 6, 73, 1, NOW(), NOW()),
  ('ef46cb29-c529-45e9-ac30-11c49edddaa3', '47f83354-e694-43e4-9b88-f4fc3bf9322a', '8b246f0e-1dfa-4691-83c2-5655a34b067d', 'Bachelor of Media Studies', 'BMS', 'UG', 3, 6, 117, 1, NOW(), NOW());

-- ============================================================
-- STEP 4: branch
-- ============================================================
INSERT INTO branch
  (branch_id, programm_id, depart_id, branch_name, branch_code, total_intake, accreditation_status, established_year, status, createdAt, updatedAt)
VALUES
  ('745df7c3-b302-4069-94f8-6edb71877422', 'b8f62072-4115-4978-9de6-3272308a4f59', 'c41ad7c3-1446-4974-9f9a-851d784eaa67', 'Computer Science & Engineering', 'CSE', 120, 'NBA Accredited', 1993, 1, NOW(), NOW()),
  ('1f012905-6474-4171-b2be-c7a5438cab54', '6610bacd-4d78-4206-9542-2bfed77acba8', '2849e3f6-b36d-40dc-ba1b-044ad6d75587', 'Artificial Intelligence & ML', 'AIML', 60, 'NBA Accredited', 1985, 1, NOW(), NOW()),
  ('5b5dfb1d-1a9d-403f-97c6-75f3c79fca3f', '765a1489-1f79-46ff-afcb-39e12de112d7', 'aa6da51a-067d-478c-9093-3356eae5c743', 'Data Science', 'DS', 60, 'Pending', 2022, 1, NOW(), NOW()),
  ('5384e298-7852-42a1-9ad8-53b5b48a5fe4', '2dc22bf6-5faa-4b89-8a62-2d62862adc2b', 'f1745543-89ac-4a7a-9806-9b3a400043c0', 'Mechanical Engineering', 'ME', 60, 'NBA Accredited', 1989, 1, NOW(), NOW()),
  ('5753513c-8849-4d11-9b6a-96ba127a2f91', 'ad31e11f-495c-4216-809b-545cd995b55e', '2baa51dc-92c4-4bef-9fd6-cb62221a05de', 'Automobile Engineering', 'AUTO', 60, 'Not Accredited', 2021, 1, NOW(), NOW()),
  ('c06e0888-df99-4cb0-aca7-a53b0f66605e', '25bd0f9b-6aac-4b3e-bae1-749614489e47', 'b964fa32-6130-4026-b1c6-9939a954f2c5', 'Electronics & Telecommunication', 'EXTC', 60, 'NBA Accredited', 2001, 1, NOW(), NOW()),
  ('d9a66a7a-06d2-488a-9b79-92401330b8c8', '32cd7b36-bc25-4930-9392-dca97a894515', '75633b6e-d488-4346-9fbe-d10e3e7738bb', 'ME Computer (Specialisation: AI)', 'MEAI', 30, 'NBA Accredited', 1989, 1, NOW(), NOW()),
  ('539fffec-f60f-4339-b9a7-56d0af5ae9ee', 'b5dbb1a2-7939-40b9-bfe1-d594ba1170c6', '6846ade4-288d-4517-a35d-6f25aa8c57ed', 'General Medicine', 'MED', 100, 'MCI Approved', 1985, 1, NOW(), NOW()),
  ('29272960-9678-4e39-b57e-5eaf6d77e58d', '0ace32aa-416e-42c8-b007-cc4f07e62963', '5e9faa8c-6f23-485f-9c08-d01ec04a7597', 'Pharmaceutical Sciences', 'PHRM', 60, 'PCI Approved', 1996, 1, NOW(), NOW()),
  ('27a899d5-9c5a-435e-8b21-5175243e4d76', '65e0e7cd-b54d-4ef4-827d-4dd16e91f6d6', '18628dcb-91b2-4165-9538-fcd30bfc91fe', 'Accounting & Finance', 'BAF', 120, 'NAAC Accredited', 1992, 1, NOW(), NOW()),
  ('14f63867-5bbe-4ddd-baf6-1bdf11a7cc38', 'd7e629c7-2b16-4d1d-a424-8f820425556f', 'f7a9cf6d-4c0d-4da8-bd4e-a548af139903', 'Banking & Insurance', 'BBI', 60, 'NAAC Accredited', 2006, 1, NOW(), NOW()),
  ('3661fef2-a66e-4dab-a1f7-ca9a8e11dfc7', '0e028462-ef4c-4152-82b9-3c5b660aa733', '8c10fe6a-9ba0-4cc1-995a-a92071898e2a', 'English Literature', 'BAEN', 60, 'Not Accredited', 1999, 1, NOW(), NOW()),
  ('92738e0c-2a1b-4f4c-a820-372077bc0720', '89a36ead-1c05-4f1c-afcd-1dc1b824ce4f', '2030de02-45cb-4b4e-aea9-20c32b8641be', 'Information Technology', 'IT', 120, 'NBA Accredited', 2005, 1, NOW(), NOW()),
  ('4f2cafab-733f-4655-9b1f-1d157e959543', '0df5f26d-a999-4b3c-8c70-fa95ab281f16', '5edfe750-e3f2-41cb-a992-b1720bd4bf37', 'Civil Engineering', 'CIVIL', 60, 'NBA Accredited', 2011, 1, NOW(), NOW()),
  ('789210a8-334c-4633-80e9-1fdb13090602', '6988e0f1-74e6-44fb-b43b-c90ef52489cb', '0ce9913c-8469-4bc0-9473-13cd26967ce0', 'Business Administration', 'BBA', 120, 'NAAC Accredited', 2024, 1, NOW(), NOW()),
  ('b4c43abd-4afc-4df2-ac99-aed3eede4ec7', 'b879a418-2011-41dd-9914-80dbcdbe78ea', '18e5571f-1321-4c9a-a1eb-b5102ea271db', 'Corporate Law', 'CLAW', 60, 'BCI Approved', 2009, 1, NOW(), NOW()),
  ('337a5c87-1448-443c-b0f5-652f67f72c13', '71f456e7-b3a5-40d5-96a2-ccfe8d2645d0', '7efcb309-3635-4008-b638-98551ad2f210', 'Fashion Design', 'FD', 60, 'Not Accredited', 1995, 1, NOW(), NOW()),
  ('6861d324-3208-415d-9a73-409ad03ca8ff', '5ee379ee-3c51-414b-b264-6b91a14b10bf', 'd865071e-8b46-4298-91f8-5659ff518777', 'Architecture', 'ARCH', 40, 'COA Approved', 1994, 1, NOW(), NOW()),
  ('a1d2b45e-5aa9-4363-be44-b2f74646fd25', 'df6aa607-853b-449d-8639-6e9d3781afed', '922d2f27-ceab-4fb0-a8e7-100f55c9d053', 'Nursing', 'NUR', 60, 'INC Approved', 2000, 1, NOW(), NOW()),
  ('56d653b2-e47b-4ae5-ba38-1c310b46114e', 'ef46cb29-c529-45e9-ac30-11c49edddaa3', '8b246f0e-1dfa-4691-83c2-5655a34b067d', 'Physical Education', 'BPEd', 100, 'NCTE Approved', 2010, 1, NOW(), NOW());
