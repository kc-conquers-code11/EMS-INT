Architecture Context: This document outlines the technical implementation and data flow for the Core Examination Management System, encompassing Pre-Exam Logistics, Secure Evaluation, Disciplinary Actions (UFM), Analytics, and Revaluation. (Note: Question Paper Generation architecture is documented separately).

Tech Stack: React (Vite), Node.js, Express, Sequelize (ORM), SQL, Tailwind CSS.

1. Role-Based Access Control (RBAC) & Pre-Exam Logistics
Objective: Securely manage faculty duties and exam room allocations.

Implementation: * Implemented a strict JWT-based RBAC system defining boundaries between Student, Faculty, HOD, and COE.

Duty Allocation Engine: COE dynamically assigns invigilation duties. The backend utilizes a state machine (PENDING -> ACCEPTED / REJECTED) allowing faculty to accept supervisor duties via their dedicated dashboard.

Relational Mapping: Exam block allocations are fetched via complex joins linking faculty, timetable, rooms, and subject_mapping.

2. Exam Day Operations (Attendance & Malpractice Trigger)
Objective: Real-time tracking of student presence and initial disciplinary reporting.

Implementation:

Blockwise Attendance Grid: A high-density UI allowing faculty to toggle student states (PRESENT, ABSENT).

Malpractice Hook: Integrated a "Report Malpractice" trigger directly within the attendance grid. Flagging a student here automatically seeds a pending record into the copy_case table, bridging Exam Day operations with the Disciplinary Engine.

3. The Core Evaluation Engine (Marks Entry)
Objective: Secure, immutable recording of raw component-level scores.

Implementation:

Component-level data architecture capturing Theory, Internal Assessment (IA), and Practical scores in the marks_entry table.

Validation & Constraints: The React frontend and Node.js backend both strictly enforce maximum mark constraints derived from the syllabus schema.

State Lock Mechanism: Once a faculty member clicks "Lock & Submit", the is_locked boolean is toggled to true. This creates an immutable audit trail; the faculty can no longer PUT or PATCH the record, preventing post-submission tampering.

4. Secure On-Screen Evaluation (Blind Grading)
Objective: Eliminate evaluator bias during the re-checking process.

Implementation:

Designed the revaluation_entry table to operate independently of standard PRNs (Permanent Registration Numbers).

Data Masking: The backend dynamically generates a UUID-based "Dummy Number" (e.g., REV-10245). The evaluating faculty only receives this dummy identifier alongside the digital answer script, ensuring 100% blind grading.

5. Disciplinary Action Engine (UFM / Copy Cases)
Objective: Process Unfair Means (UFM) reports and enforce institutional penalties.

Implementation:

Zero-Bloat Schema: Reused existing punishment_reason and coe_remark columns rather than bloating the database, mapping them to standard dropdown penalties via the COE dashboard.

Query Optimization: Utilized a 5-table LEFT JOIN to aggregate disjointed student, subject, and invigilator data into a single, cohesive administrative view.

State Machine: Cases default to PENDING (bubbling to the top of the COE queue) and transition to RESOLVED once a penalty (e.g., "Cancel Subject", "Debar") is applied.

6. CO-PO Analytics & Marksheet Verification
Objective: Generate automated NBA/NAAC accreditation data while strictly enforcing UFM penalties.

Implementation:

Penalty Enforcement (The Override): During marks aggregation, the engine performs a LEFT JOIN on the copy_case table. If a student has a RESOLVED severe penalty, the backend dynamically overrides their total_marks to 0 and flags is_ufm = true without destroying the original marks_entry audit trail.

Attainment Proxy Strategy: Due to component-level marking, the engine calculates the percentage of the class exceeding a 60% threshold. This generates a 3-tier Attainment Level, which is then cross-referenced with the co_po_mapping table to output the final weighted PO Matrix.

7. End-to-End Revaluation Pipeline
Objective: Handle student appeals securely without risking regression in the analytics engine.

Implementation:

3-Actor Flow: 1. Student: Initiates a request, generating a reval_application record (status: PAID).
2. COE: Dispatches the application, silently generating a masked row in the revaluation_entry table.
3. Faculty: Evaluates the paper via the Blind Grading UI (see Section 4).

The Final Resolution Logic: The Analytics Engine utilizes the SQL GREATEST() function (or Math.max()) to automatically select the highest score between original_marks and revised_marks.

Security Hierarchy: The UFM penalty override remains the absolute highest authority in the logic tree. Even if a revaluation scores 100%, a is_ufm === true flag will crush the final published result to 0.

UI/UX & Frontend Philosophy
All frontend modules were built using React and Tailwind CSS, adhering strictly to a "Lab/Engineering" Aesthetic.

High Data Density: UIs resemble complex spreadsheets to allow faculty to process hundreds of students rapidly.

Light Theme Exclusivity: Dark mode is explicitly disabled to ensure high-contrast readability and native support for physical printing (window.print()) for university record-keeping.
<!-- KC - 6th june 2026 -->