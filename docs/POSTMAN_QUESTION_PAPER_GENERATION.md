# Postman Guide: Question Paper Generation (Upload Workflow)

Faculty prepare question papers **offline in Word** (`.doc` / `.docx`) and upload them. There is **no in-app question editor** or question bank integration in this flow.

**Base URL:** `http://localhost:5000`  
**API prefix:** `/api/v1/exam/paper-set`

---

## Status lifecycle

```text
REQUESTED          → COE created request
ACCEPTED           → Faculty accepted; prepare offline
DRAFT              → Faculty uploaded Word file (can replace until lock)
SUBMITTED_TO_COE   → Faculty lock & submit (file immutable for faculty)
FINAL_LOCKED       → COE final lock (immutable for everyone)
```

```text
COE Creates Request → Faculty Accepts → Offline Word prep → Upload → Lock & Submit → COE Review/Download → COE Final Lock
```

---

## Authentication

All routes require `Authorization: Bearer <token>`.

| Role | Login |
|------|--------|
| COE | `POST /api/v1/auth/login` |
| Faculty | Same endpoint (faculty account from department setup) |

---

## Endpoints

### 1. COE — Create request

`POST {{base_url}}/api/v1/exam/paper-set/request`

```json
{
  "event_id": "exam-event-uuid",
  "subject_id": "subject-uuid",
  "faculty_id": "faculty-uuid",
  "academic_id": "academic-year-uuid",
  "semester_id": "semester-uuid",
  "exam_type": "End Semester",
  "set_name": "CS101 End Semester Paper",
  "instructions": "Include 2 compulsory questions. Max 80 marks.",
  "submission_deadline": "2026-07-15"
}
```

`academic_id`, `semester_id`, `exam_type` are optional (defaults from exam event when omitted).

**Response:** `201` — `paper_status: "REQUESTED"`

---

### 2. Faculty — List requests

`GET {{base_url}}/api/v1/exam/paper-set?paper_status=REQUESTED`

Faculty only sees their assigned requests.

---

### 3. Faculty — Accept request

`PUT {{base_url}}/api/v1/exam/paper-set/{{set_id}}/accept`

No body.

**Response:** `paper_status: "ACCEPTED"`

---

### 4. Faculty — Upload Word document

`POST {{base_url}}/api/v1/exam/paper-set/{{set_id}}/upload`

- **Body:** `form-data`
- **Key:** `file` (type: File)
- **Allowed:** `.doc`, `.docx` (max 15 MB)

**Response:** `paper_status: "DRAFT"`, includes `file_url`, `uploaded_at`, `uploaded_by`

Faculty may re-upload while status is `ACCEPTED` or `DRAFT` (before lock).

---

### 5. Faculty — Lock & submit

`PUT {{base_url}}/api/v1/exam/paper-set/{{set_id}}/lock-submit`

No body. Requires uploaded file.

**Response:** `paper_status: "SUBMITTED_TO_COE"`  
After this, faculty **cannot** upload, replace, or delete the file.

---

### 6. COE — Download for review

`GET {{base_url}}/api/v1/exam/paper-set/{{set_id}}/download`

Returns the Word file as attachment.

---

### 7. COE — Final lock

`POST {{base_url}}/api/v1/exam/paper-set/{{set_id}}/final-lock`

```json
{
  "remarks": "Reviewed and approved for Summer 2026 examination."
}
```

Requires `SUBMITTED_TO_COE`.

**Response:** `paper_status: "FINAL_LOCKED"` — no further changes allowed.

---

### 8. Shared — Get details

`GET {{base_url}}/api/v1/exam/paper-set/{{set_id}}`

Includes audit fields: `uploaded_at`, `faculty_locked_at`, `coe_final_locked_at`, joined exam/subject/faculty names.

---

### 9. Audit history

`GET {{base_url}}/api/v1/exam/paper-set/{{set_id}}/history`

Actions: `request_created`, `accepted`, `file_uploaded`, `faculty_locked`, `coe_final_locked`

---

## Postman test sequence

| # | Role | Request |
|---|------|---------|
| 1 | COE | Login → save token |
| 2 | Faculty | Login → save token |
| 3 | COE | `POST /request` |
| 4 | Faculty | `PUT /{id}/accept` |
| 5 | Faculty | `POST /{id}/upload` (attach .docx) |
| 6 | Faculty | `PUT /{id}/lock-submit` |
| 7 | COE | `GET /{id}/download` |
| 8 | COE | `POST /{id}/final-lock` |

---

## Storage

Files stored under: `EMS-Backend/uploads/question-papers/{set_id}/`  
Public URL pattern: `/uploads/question-papers/{set_id}/{filename}`

---

## Removed endpoints (old in-app question builder)

These are **no longer available:**

- `POST /:set_id/questions`
- `PUT /:set_id/submit` (replaced by `lock-submit`)
- `POST /:set_id/approve` / `reject` (replaced by `final-lock`)

---

## Database

UUID columns, **no foreign keys** — all relations via JOINs in `paperSet.service.js`.  
Schema: `seeders/schema.sql` and `seeders/migrations/paper_set_uuid_tables.sql`.

---

## Source files

| File | Purpose |
|------|---------|
| `src/models/paper_set.js` | Request + file + audit columns |
| `src/services/exam/paperSet.service.js` | Business logic (JOINs) |
| `src/controllers/exam/paperSet.controller.js` | HTTP handlers |
| `src/routes/exam/paperSet.route.js` | Routes + multer |
| `src/helpers/paperSetUpload.helper.js` | File upload storage |
| `src/constants/paperSet.constants.js` | Status constants |
