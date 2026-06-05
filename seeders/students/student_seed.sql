-- Demo students for Sunrise BE (CSE / AIML). Does not truncate — preserves admin-seeded students.
SOURCE seed_constants.sql;

INSERT INTO student_personaldetails (
  personal_id, stud_id, name, first_name, last_name, gender_id, email, contact, createdAt, updatedAt
) VALUES
(@pd_alice, @stu_alice, 'Alice Anderson', 'Alice', 'Anderson', 1, 'alice.anderson@example.com', '9876543210', @now, @now),
(@pd_bob, @stu_bob, 'Bob Kumar', 'Bob', 'Kumar', 1, 'bob.kumar@test.com', '9876543211', @now, @now),
(@pd_carol, @stu_carol, 'Carol Singh', 'Carol', 'Singh', 2, 'carol.singh@test.com', '9876543212', @now, @now),
(@pd_david, @stu_david, 'David Patel', 'David', 'Patel', 1, 'david.patel@test.com', '9876543213', @now, @now),
(@pd_eva, @stu_eva, 'Eva Sharma', 'Eva', 'Sharma', 2, 'eva.sharma@test.com', '9876543214', @now, @now)
ON DUPLICATE KEY UPDATE name = VALUES(name), contact = VALUES(contact), updatedAt = @now;

INSERT INTO students (
  sid, stud_clg_id, uid, program_id, cat_id, seat_type_id, branch_id,
  personal_details_id, father_id, mother_id, guardian_id, doc_ids, dd_id, neft_id,
  academic_year, createdAt, updatedAt
) VALUES
(@stu_alice, 'STU001', 'e1234567-89ab-cdef-0123-456789abcdef', @prog_be_ce, @cat_demo, @seat_demo, @branch_cse,
 @pd_alice, @father_demo, @mother_demo, @guardian_demo, @doc_demo, @dd_demo, @neft_demo, '2024-25', @now, @now),
(@stu_bob, 'VU4S2425002', 'u2222222-2222-4222-8222-222222222222', @prog_be_ce, @cat_demo, @seat_demo, @branch_cse,
 @pd_bob, @father_demo, @mother_demo, @guardian_demo, @doc_demo, @dd_demo, @neft_demo, '2024-25', @now, @now),
(@stu_carol, 'VU4S2425003', 'u3333333-3333-4333-8333-333333333333', @prog_be_ce, @cat_demo, @seat_demo, @branch_cse,
 @pd_carol, @father_demo, @mother_demo, @guardian_demo, @doc_demo, @dd_demo, @neft_demo, '2024-25', @now, @now),
(@stu_david, 'VU4S2425004', 'u4444444-4444-4444-8444-444444444444', @prog_be_ce, @cat_demo, @seat_demo, @branch_aiml,
 @pd_david, @father_demo, @mother_demo, @guardian_demo, @doc_demo, @dd_demo, @neft_demo, '2024-25', @now, @now),
(@stu_eva, 'VU4S2425005', 'u5555555-5555-4555-8555-555555555555', @prog_be_ce, @cat_demo, @seat_demo, @branch_cse,
 @pd_eva, @father_demo, @mother_demo, @guardian_demo, @doc_demo, @dd_demo, @neft_demo, '2024-25', @now, @now)
ON DUPLICATE KEY UPDATE branch_id = VALUES(branch_id), updatedAt = @now;
