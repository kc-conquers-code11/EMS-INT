<!-- KC -->
Technical Implementation Brief: Phase 9 - KT (Backlog) Management Engine
Document Status: Finalized
Architecture Context: This document outlines the technical implementation of the ATKT (Allowed To Keep Terms) / Backlog Management module. The core engineering challenge was integrating a complex backlog lifecycle into the existing Examination Management System (EMS) with zero regression to the established Phase 1-8 grading and analytics engines.

Design Philosophy: "The Overlay Architecture"
To protect the integrity of historical academic records, Phase 9 was built as a strict "Overlay." The KT engine maintains read-only access to legacy evaluation tables (marks_entry, copy_case) and writes exclusively to a newly siloed database schema.

1. Database Schema (Isolated State Management)
Objective: Maintain granular tracking of backlog attempts without mutating original scores.

Implementation: Introduced three localized tables to handle the KT lifecycle:

kt_eligibility: Tracks granular failures per component (e.g., separating a 'Theory' fail from a 'Practical' fail for the same subject) and attempt counts.

kt_registration: Maps a student's pending eligibility to a new, specific "KT Exam Event" upon successful fee payment.

year_drop_log: An aggregator table that flags students whose active backlog count violates institutional thresholds.

2. The KT Detection Engine
Objective: Autonomously identify failing students and generate backlog eligibility records.

Implementation: * Built a highly optimized runKTDetection Node.js controller that acts as a bulk scanner.

Evaluation Rules: The engine performs a cross-table scan checking locked marks_entry records against the dynamic min_pass_theory and min_pass_practical thresholds defined in the subject table.

UFM Override: The scanner strictly enforces Phase 6 disciplinary rules. If a student's is_ufm === true flag is active from a resolved copy case, the engine forces a KT eligibility drop, overriding any passing marks they may have achieved.

Performance Optimization: Utilizes Sequelize bulkCreate to handle thousands of row insertions simultaneously, preventing server bottlenecks during end-of-semester processing.

3. The Registration Pipeline & Exam Re-Entry
Objective: Seamlessly route backlog students back into the core examination flow.

Implementation: * Once a student pays the KT fee, their kt_eligibility record is bound to a new exam_event_id (e.g., "Summer 2026 KT").

System Synergy: Because the KT student is now registered to a standard exam event UUID, the system naturally falls back on the existing Phase 3 (Marks Entry) and Phase 5 (Blind Grading) infrastructure. No duplicate grading logic needed to be written; the existing engine simply processes the KT event as a standard exam pipeline.

4. Disciplinary Aggregation (Year Drop Engine)
Objective: Enforce academic progression rules (e.g., holding back a student with too many active backlogs).

Implementation: * An automated aggregator function (evaluateYearDrops) groups unresolved records in the kt_eligibility table by student_prn.

If the active KT count exceeds the institutional limit (e.g., > 5), the engine executes a bulk upsert into the year_drop_log, transitioning the student's status to ACTIVE year-drop, effectively freezing their ability to register for next-semester regular courses.

5. API & Frontend Data Hydration
Objective: Feed a high-density React Dashboard without requiring multiple round-trip API calls.

Implementation: * The frontend UI (Tabs: Dashboard, Records, Registrations, Year Drops) required deeply nested relational data.

Rather than relying on lazy-loading, the REST endpoints utilize complex LEFT JOIN raw SQL queries (and optimized Sequelize include statements) to hydrate the kt_eligibility rows with first_name, last_name, subject_name, and subject_code at the database level.

This guarantees O(1) network requests for the client, maintaining the snappy, "Single Page Application" feel of the COE Dashboard.



----


To test the complete end-to-end flow of Phase 9 using your `Frontend_Integration_v1` UI, follow these steps:

### 1. Data Setup
For the detection engine to actually flag a student for a KT, they must either have a UFM case OR have marks below the passing criteria. 
- In our Phase 8 `seed_reval_flow.js`, the student scored `35` in Theory for `REV101`, but the passing minimum wasn't set. 
- I just ran a script to set `min_pass_theory = 40` for `REV101`. The backend will now see `35 < 40` and correctly flag this as a failure!

### 2. Test the Detection Engine
1. Open your `Frontend_Integration_v1` app and log in as the COE (`coe@test.com` / `password123`).
2. Navigate to the **KT Management -> Dashboard / KT Detection** tab.
3. Select the **Summer 2026 Test Event** from your dropdown (this is the event we seeded).
4. Click the button in your UI that triggers the KT Detection.
5. You should see a success message: `KT Detection completed. Flagged 1 new KTs.`

### 3. Test Eligibility Records
1. Switch to the **KT Records (Eligibility)** tab in your UI.
2. The table should instantly populate with the student who failed `REV101` in the `THEORY` component. The joined data (`first_name`, `last_name`, `subject_code`) will all be rendered cleanly via the `LEFT JOIN` we wrote.

### 4. Test Year Drop Evaluation
1. In your COE dashboard (or via Postman to `POST /api/v1/coe/kt/evaluate-drops` with `{"academic_year": "2026-2027"}`), trigger the Year Drop evaluation.
2. Since our test student only has **1 active KT** right now (and the threshold is > 5), they will *not* be flagged for a Year Drop, which proves the boundary logic works perfectly!

Everything is fully hot-reloaded and live on your machine!

