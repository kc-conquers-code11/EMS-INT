-- =============================================================================
-- EMS shared seed constants (SOURCE this file before other seeders)
-- Matches live schema: UUID PKs, semester.term_type, programme_id on semester
-- =============================================================================

SET @now = NOW();

-- Institution & masters (Sunrise Engineering College = primary demo institution)
SET @inst_sunrise     = '4739f88f-fec7-4aa9-92b1-4636d62a828d';
SET @dept_ce          = 'c41ad7c3-1446-4974-9f9a-851d784eaa67';
SET @prog_be_ce        = 'b8f62072-4115-4978-9de6-3272308a4f59';
SET @branch_cse         = '745df7c3-b302-4069-94f8-6edb71877422';
SET @branch_aiml        = '1f012905-6474-4171-b2be-c7a5438cab54';
SET @acad_2024_25       = '914ed942-a39c-423f-ad02-0c9c21a24084';
SET @sem_cse_6_even     = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
SET @sem_aiml_4_odd     = 'f56e9cdd-d3f8-4ff2-a545-de9e0cfa77b5';
SET @scheme_ce          = '0ca2e362-bd04-4c1e-81b5-07bb48df9385';
SET @subj_cs101         = '7781e34d-cb17-41ba-99ba-b4b9eb8d875e';
SET @subj_cs101p        = 'c089e0dc-9344-45c3-8050-6ebfcb0a4802';

-- Exam events
SET @event_summer_2026  = '8c66980a-aafe-4004-8bee-75d9d305ddf1';
SET @event_jury         = '0f1827a9-4756-4847-aec7-b8e970a070a5';
SET @event_backlog      = '0c255bb3-ba97-48db-87d4-13d1d317ce41';

-- Students (personaldetails.stud_id = students.sid)
SET @stu_alice          = '57ba62ff-3e61-4384-b940-4dfdd92da14e';
SET @pd_alice           = 'a3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e';
SET @stu_bob            = '349c7406-bddf-490e-b8f6-f9f20cae04fc';
SET @pd_bob             = 'spd22222-2222-4222-8222-222222222222';
SET @stu_carol          = 'stu33333-3333-4333-8333-333333333333';
SET @pd_carol           = 'spd33333-3333-4333-8333-333333333333';
SET @stu_david          = 'stu44444-4444-4444-8444-444444444444';
SET @pd_david           = 'spd44444-4444-4444-8444-444444444444';
SET @stu_eva            = 'stu55555-5555-4555-8555-555555555555';
SET @pd_eva             = 'spd55555-5555-4555-8555-555555555555';

-- Shared student FK placeholders (same across all demo students)
SET @cat_demo           = 'b1234567-89ab-cdef-0123-456789abcdef';
SET @seat_demo          = 'c1234567-89ab-cdef-0123-456789abcdef';
SET @father_demo        = 'd1234567-89ab-cdef-0123-456789abcdef';
SET @mother_demo        = 'e1234567-89ab-cdef-0123-456789abcdef';
SET @guardian_demo      = 'f1234567-89ab-cdef-0123-456789abcdef';
SET @doc_demo           = '01234567-89ab-cdef-0123-456789abcdef';
SET @dd_demo            = '11234567-89ab-cdef-0123-456789abcdef';
SET @neft_demo          = '21234567-89ab-cdef-0123-456789abcdef';

-- Exam registrations
SET @reg_alice_jury     = 'c25e8a15-b740-410a-b28f-124b61ac86de';
SET @reg_alice_summer   = 'reg11111-1111-4111-8111-111111111111';
SET @reg_bob_summer     = 'reg22222-2222-4222-8222-222222222222';
SET @reg_carol_summer   = 'reg33333-3333-4333-8333-333333333333';
SET @reg_david_summer   = 'reg44444-4444-4444-8444-444444444444';
SET @reg_eva_summer     = 'reg55555-5555-4555-8555-555555555555';

-- Hall ticket
SET @hts_summer         = 'hts11111-1111-4111-8111-111111111111';
SET @ht_settings_legacy = 'bd174099-9771-4a63-8496-ebbe44e91831';
SET @admin_coe          = '4739f88f-fec7-4aa9-92b1-4636d62a828d';
SET @branch_admin_cse   = 'c5b1d68c-e3b1-444b-b2e5-33e70e72a837';

-- Summer 2026 hall ticket support (timetable + seating + PDF paths)
SET @map_summer_cs101   = 'm2b2c3d4-e5f6-7890-abcd-ef1234567892';
SET @reg_subj_alice_sum = 'rs11111-1111-4111-8111-111111111111';
SET @reg_subj_bob_sum   = 'rs22222-2222-4222-8222-222222222222';
SET @reg_subj_eva_sum   = 'rs55555-5555-4555-8555-555555555555';
SET @reg_subj_eva_sum_p = 'rs55556-5555-4555-8555-555555555556';
SET @map_summer_cs101p  = 'm3b2c3d4-e5f6-7890-abcd-ef1234567894';
SET @slot_summer_morn   = 's2b2c3d4-e5f6-7890-abcd-ef1234567893';
SET @slot_summer_after  = 's3b2c3d4-e5f6-7890-abcd-ef1234567894';
SET @tt_summer_cs101    = 't2b2c3d4-e5f6-7890-abcd-ef1234567802';
SET @tt_summer_cs101p   = 't3b2c3d4-e5f6-7890-abcd-ef1234567803';
SET @seat_alice_summer  = 'e2b2c3d4-e5f6-7890-abcd-ef1234567801';
SET @seat_bob_summer    = 'e2b2c3d4-e5f6-7890-abcd-ef1234567802';
SET @seat_eva_summer    = 'e2b2c3d4-e5f6-7890-abcd-ef1234567805';
SET @ht_alice_summer    = 'ht333333-3333-4333-8333-333333333333';
SET @ht_bob_summer      = 'ht444444-4444-4444-8444-444444444444';

-- EMS admin portal students (std1@ems.com / std2@ems.com) — same sid as @stu_alice / @stu_bob
SET @uid_std1           = '3d7e5c82-58fa-4f0a-9d8f-4b51b6ce06d5';
SET @uid_std2           = '9c4d1537-4667-4273-bda2-9bd3c75b79cb';

-- Timetable / seating (jury event)
SET @map_cs101          = 'a1b2c3d4-e5f6-7890-abcd-ef1234567811';
SET @reg_subj_cs101     = 'b1b2c3d4-e5f6-7890-abcd-ef1234567822';
SET @slot_morning       = 'c1b2c3d4-e5f6-7890-abcd-ef1234567833';
SET @tt_cs101           = 'f1b2c3d4-e5f6-7890-abcd-ef1234567801';
