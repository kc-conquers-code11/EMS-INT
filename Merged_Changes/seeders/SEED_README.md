# EMS Database Seeders

Run against database `ems` after base schema exists (`schema.sql` or Sequelize sync).

## Quick start

```bash
cd EMS-Backend/seeders
chmod +x run_all_seeds.sh
./run_all_seeds.sh krrish krrish ems
```

`run_all_seeds.sh` applies hall-ticket schema patches (`hall_ticket/00_hall_ticket_schema.sql`) then runs all data seeders in dependency order.

## Run order (dependencies)

All seed SQL files (except `schema.sql`) begin with `SOURCE seed_constants.sql` — run commands from the `seeders/` directory.

| Step | File | Purpose |
|------|------|---------|
| 1 | `admin/ems_admin_seed.sql` | Users, faculty, principal, students std1–std5, hall ticket permissions |
| 2 | `programme/ems_programme_seed.sql` | Institution, programmes, branches |
| 3 | `subject/subject_seed.sql` | CS101 subjects |
| 4 | `exam_fees/exam_fees_seed.sql` | Academic years, semesters, exam events |
| 5 | `students/student_seed.sql` | Demo students (Alice–Eva) — merges with admin students |
| 6 | `exam_fees/exam_registrations_seed.sql` | Summer 2026 + jury registrations |
| 7 | `payment/payment_seed.sql` | Fee transactions |
| 8 | `timetable/timetable_seed.sql` | Jury timetable |
| 9 | `allocation/*` | Blocks, seating, supervisors |
| 10 | `hall_ticket/00_hall_ticket_schema.sql` | Idempotent columns for hall ticket module |
| 11 | `hall_ticket/hall_ticket_eligibility_seed.sql` | Summer settings, timetable, seating, eligibility |
| 12 | `hall_ticket/hall_ticket_seed.sql` | Sample `hall_tickets` rows + legacy settings |

Optional: `admin/principal_faculty_seed.sql` (principal is also in `ems_admin_seed.sql`).

## Shared IDs

Cross-table references live in `seed_constants.sql` (institution, exam events, students, registrations, hall ticket IDs).

## Hall ticket demo (COE + student portal)

| Item | Value |
|------|--------|
| Exam event | Summer 2026 Regular Exam |
| `exam_event_id` | `8c66980a-aafe-4004-8bee-75d9d305ddf1` |
| Settings row id | `hts11111-1111-4111-8111-111111111111` |
| Principal signature | `uploads/faculty/principal/sign.png` |
| COE login | `krrishmahar5@gmail.com` (from admin seed) |
| Student std1 (Alice) | `std1@ems.com` / `57ba62ff-3e61-4384-b940-4dfdd92da14e` / STU001 |
| Student std2 (Bob) | `std2@ems.com` / `349c7406-bddf-490e-b8f6-f9f20cae04fc` / STU002 |
| PDF path pattern | `uploads/students/CSE/{STU00x}/hall_ticket.pdf` |

**Flow after seeding**

1. COE: Hall Ticket Settings → save for Summer 2026 event.
2. COE: Generate Hall Tickets (eligible: Alice, Bob; Carol/Eva ineligible).
3. COE: Publish Now (15s delay) → enables settings + generates PDFs.
4. Student: `std2@ems.com` → Hall Ticket → view/download.

Seeded settings start as `hall_ticket_status = disabled` and `exam_event.is_published = 0` until COE publishes.

## Other demo flows

| Flow | Exam event | Event ID |
|------|------------|----------|
| Payment / jury timetable | Final Term Jury Presentation | `0f1827a9-4756-4847-aec7-b8e970a070a5` |
