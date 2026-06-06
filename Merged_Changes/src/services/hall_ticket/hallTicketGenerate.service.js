const fs = require('fs');
const crypto = require('crypto');
const db = require('../../../models');
const { hallTicketGenerateSchema } = require('../../validations/hall_ticket/hallTicket.validations');
const hallTicketSettingsService = require('./hallTicketSettings.service');
const {
  generateHallTicketPdf,
  resolveHallTicketStorage,
} = require('../../helpers/hallTicket.helper');
const { getPrincipalSignatureForHallTicket } = require('../../utils/principalSignature.util');
const {
  isOnOrAfterReleaseDate,
  isOnOrBeforeDownloadLastDate,
} = require('../../utils/hallTicketDate.util');
const {
  normalizeExamSchedule,
  scheduleToSubjectRows,
} = require('../../utils/hallTicketSchedule.util');
const { queryHallTicketRegistration } = require('../../utils/hallTicketRegistrationQuery.util');

/**
 * Assert hall ticket window and status for an exam event.
 * @param {object} settings
 * @param {{ skipDateWindowCheck?: boolean, skipStatusCheck?: boolean }} [options]
 */
const assertHallTicketAvailability = (settings, options = {}) => {
  if (!settings) {
    throw { status: 404, message: 'Hall ticket settings not found for this exam event' };
  }

  const status =
    settings.hall_ticket_status ||
    (settings.is_enabled ? 'enabled' : 'disabled');

  if (!options.skipStatusCheck && status !== 'enabled') {
    throw { status: 403, message: 'Hall ticket generation is disabled' };
  }

  if (!options.skipDateWindowCheck) {
    if (settings.release_date && !isOnOrAfterReleaseDate(settings.release_date)) {
      throw { status: 403, message: 'Hall ticket not yet available' };
    }
    if (
      settings.download_last_date &&
      !isOnOrBeforeDownloadLastDate(settings.download_last_date)
    ) {
      throw { status: 403, message: 'Hall ticket download period has ended' };
    }
  }
};

/**
 * Build hall ticket payload for a student and exam event (no PDF).
 * @param {string} student_id
 * @param {string} exam_event_id
 * @param {{ skipDateWindowCheck?: boolean, skipStatusCheck?: boolean, include_principal_signature?: boolean }} [options]
 * @returns {Promise<object>}
 */
const buildHallTicketPayload = async (student_id, exam_event_id, options = {}) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(exam_event_id);
  assertHallTicketAvailability(settings, options);

  const rows = await queryHallTicketRegistration(student_id, exam_event_id);

  if (!rows.length) {
    throw { status: 404, message: 'No confirmed exam registration found for this student and event' };
  }

  const row = rows[0];
  let instructions = settings?.instructions || [];
  if (typeof instructions === 'string') {
    try {
      instructions = JSON.parse(instructions);
    } catch {
      instructions = [];
    }
  }

  const scheduleNormalized = normalizeExamSchedule(row);

  const studentName =
    `${row.first_name || ''} ${row.last_name || ''}`.trim() ||
    row.name ||
    'Student';

  return {
    student_id: row.sid,
    exam_reg_id: row.exam_reg_id,
    enrollment_id: row.stud_clg_id || '-',
    student_name: studentName,
    branch: row.branch_name || '-',
    branch_code: row.branch_code || null,
    semester: row.semester_number
      ? `${row.semester_number}${row.term_type ? ` (${row.term_type})` : ''}`
      : '-',
    exam_event: row.event_name,
    exam_event_id,
    seat_number: row.seat_no || 'TBD',
    programme_name: row.programme_name || '-',
    academic_year: row.academic_year || '-',
    late_exam_required: settings?.late_exam_required || 'no',
    include_principal_signature:
      options.include_principal_signature !== undefined
        ? options.include_principal_signature
        : true,
    hall_ticket_status: settings?.hall_ticket_status,
    release_date: settings?.release_date,
    download_last_date: settings?.download_last_date,
    instructions,
    subjects: scheduleToSubjectRows(scheduleNormalized),
    pdf: null,
  };
};

/**
 * Generate or return existing hall ticket for one student.
 * @param {string} student_id
 * @param {string} exam_event_id
 * @param {{ format?: string, include_principal_signature?: boolean }} [options]
 * @returns {Promise<object>}
 */
const generateHallTicket = async (student_id, exam_event_id, options = {}) => {
  const payload = await buildHallTicketPayload(student_id, exam_event_id, {
    include_principal_signature: options.include_principal_signature,
    // COE generates before student release window / publish
    skipDateWindowCheck: true,
    skipStatusCheck: true,
  });

  const existingRecords = await db.sequelize.query(
    `SELECT * FROM hall_tickets
     WHERE student_id = :student_id AND exam_reg_id = :exam_reg_id AND deletedAt IS NULL
     ORDER BY generated_at DESC LIMIT 1`,
    {
      replacements: {
        student_id,
        exam_reg_id: payload.exam_reg_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const expectedStorage = resolveHallTicketStorage({
    branch_code: payload.branch_code,
    branch_name: payload.branch,
    stud_clg_id: payload.enrollment_id,
    sid: student_id,
  });

  const existing = existingRecords[0];
  let existingFileValid = false;
  if (existing?.file_path && fs.existsSync(existing.file_path)) {
    try {
      existingFileValid = fs.statSync(existing.file_path).size > 100;
    } catch {
      existingFileValid = false;
    }
  }

  const forceRegenerate = options.forceRegenerate === true;

  if (existingFileValid && !forceRegenerate) {
    payload.pdf = {
      ticket_id: existing.ticket_id,
      file_name: existing.file_name,
      file_path: existing.file_path,
      pdf_url: existing.pdf_url,
      generated_at: existing.generated_at,
      existing: true,
    };
    return payload;
  }

  if (options.format === 'html') {
    const { generateHallTicketHtml } = require('../../templates/hallTicketTemplate');
    payload.html_preview = generateHallTicketHtml({
      sid: student_id,
      stud_clg_id: payload.enrollment_id,
      student_name: payload.student_name,
      programme_name: payload.programme_name,
      branch_name: payload.branch,
      academic_year: payload.academic_year,
      seat_no: payload.seat_number,
      event_name: payload.exam_event,
      exam_schedule: payload.subjects.map((s) => ({
        subject_code: s.course_code,
        subject_name: s.course_name,
        exam_date: s.date,
        exam_time: s.time,
      })),
      instructions: payload.instructions,
    });
    return payload;
  }

  const includePrincipalSignature = options.include_principal_signature !== false;
  const sig = await getPrincipalSignatureForHallTicket(includePrincipalSignature);

  const pdfData = {
    sid: student_id,
    stud_clg_id: payload.enrollment_id,
    student_name: payload.student_name,
    programme_name: payload.programme_name,
    branch_code: payload.branch_code || null,
    branch_name: payload.branch,
    academic_year: payload.academic_year,
    seat_no: payload.seat_number,
    event_name: payload.exam_event,
    exam_schedule: payload.subjects.map((s) => ({
      subject_code: s.course_code,
      subject_name: s.course_name,
      exam_date: s.date,
      exam_time: s.time,
    })),
    instructions: payload.instructions,
    include_principal_signature: includePrincipalSignature,
    principal_signature_src: sig.found ? sig.embedSrc : null,
    principal_signature_mime: sig.found ? sig.mimeType : null,
    principal_signature_message: sig.message,
  };

  const { filePath, fileName, fileSizeKb, downloadUrl } = await generateHallTicketPdf(pdfData);
  const ticket_id = crypto.randomUUID();
  const now = new Date();

  if (existingRecords.length > 0) {
    const now = new Date();
    await db.sequelize.query(
      `UPDATE hall_tickets SET deletedAt = :now, updatedAt = :now WHERE ticket_id = :ticket_id`,
      {
        replacements: { ticket_id: existingRecords[0].ticket_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  }

  await db.sequelize.query(
    `INSERT INTO hall_tickets
      (ticket_id, student_id, exam_reg_id, file_name, file_path, pdf_url,
       is_blocked, generated_at, createdAt, updatedAt)
     VALUES
      (:ticket_id, :student_id, :exam_reg_id, :file_name, :file_path, :pdf_url,
       0, :generated_at, :createdAt, :updatedAt)`,
    {
      replacements: {
        ticket_id,
        student_id,
        exam_reg_id: payload.exam_reg_id,
        file_name: fileName,
        file_path: filePath,
        pdf_url: downloadUrl,
        generated_at: now,
        createdAt: now,
        updatedAt: now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  payload.pdf = {
    ticket_id,
    file_name: fileName,
    file_path: filePath,
    pdf_url: downloadUrl,
    file_size_kb: fileSizeKb,
    generated_at: now,
    existing: false,
  };

  return payload;
};

/**
 * Generate hall tickets from validated request body (single or all eligible).
 * @param {object} body
 * @returns {Promise<object>}
 */
const generateHallTicketsFromRequest = async (body) => {
  const validated = hallTicketGenerateSchema.parse(body);
  const options = {
    format: validated.format === 'html' ? 'html' : 'pdf',
    include_principal_signature: validated.include_principal_signature,
    forceRegenerate: true,
  };

  if (validated.student_id) {
    const result = await generateHallTicket(
      validated.student_id,
      validated.exam_event_id,
      options
    );
    return { generated_count: 1, results: [result] };
  }

  const { students } = await require('./hallTicketGenerationControl.service').getStudentsEligibility({
    exam_event_id: validated.exam_event_id,
    eligibility_status: 'eligible',
  });

  if (!students.length) {
    throw { status: 404, message: 'No eligible students found for this exam event' };
  }

  const results = [];
  for (const student of students) {
    if (!student.student_id || student.on_hold) continue;
    try {
      const ticket = await generateHallTicket(
        student.student_id,
        validated.exam_event_id,
        options
      );
      results.push(ticket);
    } catch (err) {
      results.push({
        student_id: student.student_id,
        enrollment_id: student.enrollment_no,
        error: err.message || 'Generation failed',
      });
    }
  }

  return {
    generated_count: results.filter((r) => r.pdf || r.html_preview).length,
    results,
  };
};

module.exports = {
  assertHallTicketAvailability,
  buildHallTicketPayload,
  generateHallTicket,
  generateHallTicketsFromRequest,
};
