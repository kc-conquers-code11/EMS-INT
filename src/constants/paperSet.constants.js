/** Question paper request lifecycle (upload-based workflow). */
const PAPER_STATUS = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  DRAFT: 'DRAFT',
  SUBMITTED_TO_COE: 'SUBMITTED_TO_COE',
  FINAL_LOCKED: 'FINAL_LOCKED',
};

const PAPER_AUDIT_ACTIONS = {
  REQUEST_CREATED: 'request_created',
  ACCEPTED: 'accepted',
  FILE_UPLOADED: 'file_uploaded',
  FACULTY_LOCKED: 'faculty_locked',
  COE_FINAL_LOCKED: 'coe_final_locked',
};

const ALLOWED_UPLOAD_MIME = new Set([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_UPLOAD_EXT = new Set(['.doc', '.docx']);

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

module.exports = {
  PAPER_STATUS,
  PAPER_AUDIT_ACTIONS,
  ALLOWED_UPLOAD_MIME,
  ALLOWED_UPLOAD_EXT,
  MAX_UPLOAD_BYTES,
};
