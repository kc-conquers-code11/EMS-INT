Technical Implementation Brief: Question Paper (QP) Generator Engine
Objective:
To build a scalable, high-performance, and government-grade Question Paper Generator module. The system enables HODs and Faculties to map syllabus outcomes (COs/POs), allows the COE to dispatch paper generation tasks, and provides a dynamic, interactive React builder for faculties to draft and submit question papers under strict validation rules (Pattern A & Pattern B).
Tech Stack: React/Vite (Frontend), Node.js/Express (Backend), Sequelize (ORM), SQLite/MySQL.


1. Architectural Decisions & DB Optimization
The Problem: Storing deeply nested question papers (Questions -> Sub-questions -> Marks -> CO/PO mappings -> Modules) using standard SQL relational tables would require massive JOIN operations, causing severe backend bottlenecks and complex transaction handling.
The Solution: The JSON Payload Bypass
Instead of creating multiple tables for question parts, we optimized the paper_set table by introducing a draft_payload column of type DataTypes.JSON.
Benefit: The entire paper is fetched and saved as a single JSON object. This drastically reduces database I/O and allows the frontend to easily parse the exact hierarchical structure required for the UI.


2. Frontend State Management
The Problem: Rendering a dynamic form with 6+ main questions, each containing multiple sub-questions and 5+ input fields (Marks, CO, PO, Bloom's Level, Module) causes severe React DOM lag if state is managed using standard useState.
The Solution: react-hook-form + useFieldArray
We utilized react-hook-form to manage the massive JSON payload state without forcing component re-renders on every keystroke.
useFieldArray handles the dynamic adding/removing of Pattern B sub-questions instantly.
UI/UX: The form (QPBuilderLayout.tsx and QPQuestionInput.tsx) is designed with a high-density, light-themed "Lab/Engineering" aesthetic to prevent endless scrolling while maintaining strict legibility.


3. Core System Workflows
The module operates on a strict 4-phase state machine controlled by the verifyToken and checkRole middlewares:


Phase 1: Syllabus Governance
HODs define Program Outcomes (POs) and map specific subjects to specific Faculties.
Assigned Faculties define Course Outcomes (COs) and map them to the HOD's POs (co_po_mapping table).
Constraint: The engine locks out paper generation if these foundational mappings do not exist.

Phase 2: Task Dispatch (COE Pipeline)
The Exam Controller (COE) triggers a paper request for a specific Exam Event -> Subject -> Faculty.
This initializes a paper_set row with status: 'PENDING'.

Phase 3: The Builder Engine
The Faculty accesses the builder and selects an exam pattern.
Pattern A (Internal Assessment): Auto-scaffolds 40 marks (Q1 mandatory 2-2-1 split).
Pattern B (End Semester): Auto-scaffolds 6 questions (20 marks each).
Pre-flight Validation: Before saving to the draft_payload column, the React engine strictly enforces that Part (a) and Part (b) of any Pattern B question do not share the same Syllabus Module.

Phase 4: Locking & Governance
Faculty Submit: Faculty clicks "Lock & Submit". The frontend shifts to an immutable read-only state, and the DB status updates to SUBMITTED.
COE Review: The COE views the parsed JSON in a clean typography layout.
Rejection Loop: If rejected, the COE inputs a rejection_reason (persisted in SQL), the status reverts to DRAFT, and the Faculty dashboard displays a prominent red alert banner for corrections. If approved, the status is locked to APPROVED.

