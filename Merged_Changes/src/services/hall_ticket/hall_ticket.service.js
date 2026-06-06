const fs = require('fs');
const crypto = require('crypto');
const db = require('../../../models');
const {
  generateHallTicketPdf,
  resolveHallTicketStorage,
} = require('../../helpers/hallTicket.helper');
const hallTicketSettingsService = require('./hallTicketSettings.service');
const { assertHallTicketAvailability } = require('./hallTicketGenerate.service');
const { getStudentsEligibility } = require('./hallTicketGenerationControl.service');
const { getPrincipalSignatureForHallTicket } = require('../../utils/principalSignature.util');
const { isOnOrBeforeDownloadLastDate } = require('../../utils/hallTicketDate.util');
const { formatDownloadWindowClosedMessage } = require('../../utils/hallTicketDisplay.util');
const { queryHallTicketRegistration } = require('../../utils/hallTicketRegistrationQuery.util');

const getHallTicketSettings = async () => {
  const rows = await db.sequelize.query(
    `SELECT * FROM hall_ticket_settings LIMIT 1`,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  
  if (rows.length > 0) {
    const settings = rows[0];
    if (typeof settings.instructions === 'string') {
      try {
        settings.instructions = JSON.parse(settings.instructions);
      } catch (e) {
        settings.instructions = [];
      }
    }
    return settings;
  }
  return null;
};

const updateHallTicketSettings = async (validated) => {
  const now = new Date();

  let generatedAtQuery = '';
  const replacements = {
    is_enabled: validated.is_enabled ? 1 : 0,
    enabled_by: validated.enabled_by || null,
    instructions: JSON.stringify(validated.instructions || []),
    now,
  };

  if (validated.is_enabled) {
    generatedAtQuery = ', generated_at = :now';
  }

  const existingSettings = await db.sequelize.query(
    `SELECT id FROM hall_ticket_settings LIMIT 1`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );

  const settingsId = existingSettings.length > 0 ? existingSettings[0].id : null;

  if (settingsId) {
    await db.sequelize.query(
      `UPDATE hall_ticket_settings 
       SET is_enabled = :is_enabled, 
           enabled_by = :enabled_by, 
           instructions = :instructions,
           updatedAt = :now 
           ${generatedAtQuery}
       WHERE id = :settingsId`,
      {
        replacements: { ...replacements, settingsId },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  } else {
    const newId = crypto.randomUUID();
    await db.sequelize.query(
      `INSERT INTO hall_ticket_settings 
       (id, is_enabled, enabled_by, instructions, generated_at, createdAt, updatedAt)
       VALUES 
       (:id, :is_enabled, :enabled_by, :instructions, ${validated.is_enabled ? ':now' : 'NULL'}, :now, :now)`,
      {
        replacements: { ...replacements, id: newId },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );
  }

  return await getHallTicketSettings();
};

const { normalizeExamSchedule } = require('../../utils/hallTicketSchedule.util');

const buildStudentPdfPayload = (row, instructions, signatureFields = {}) => ({
  sid: row.sid,
  stud_clg_id: row.stud_clg_id || row.sid,
  student_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Student',
  photo_url: row.photo_url || null,
  programme_name: row.programme_name || '-',
  branch_code: row.branch_code || undefined,
  branch_name: row.branch_name || 'Unknown',
  academic_year: row.academic_year || '-',
  seat_no: row.seat_no || 'TBD',
  event_name: row.event_name,
  exam_schedule: normalizeExamSchedule(row),
  instructions: instructions || [],
  ...signatureFields,
});

const removeStaleHallTicketArtifacts = (existingRecord, expectedFilePath) => {
  if (!existingRecord?.file_path) return;
  const stalePath = existingRecord.file_path;
  if (stalePath !== expectedFilePath && fs.existsSync(stalePath)) {
    try {
      fs.unlinkSync(stalePath);
    } catch (err) {
      console.warn('[hall_ticket] could not remove stale file:', stalePath, err.message);
    }
  }
};

/**
 * Students may download only after COE publish (hall_ticket_status enabled).
 */
const assertStudentHallTicketPublished = async (studentId, eventId) => {
  const rows = await db.sequelize.query(
    `SELECT
      er.exam_reg_id,
      hts.hall_ticket_status,
      ee.is_published
    FROM exam_registration er
    INNER JOIN exam_event ee ON ee.event_id = er.event_id AND ee.deletedAt IS NULL
    LEFT JOIN hall_ticket_settings hts ON hts.exam_event_id = er.event_id
    WHERE er.sid = :studentId
      AND er.event_id = :eventId
      AND er.reg_status = 'confirmed'
    LIMIT 1`,
    {
      replacements: { studentId, eventId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!rows.length) {
    throw { status: 404, message: 'No confirmed exam registration found' };
  }

  const row = rows[0];
  const published =
    row.hall_ticket_status === 'enabled' || Number(row.is_published) === 1;

  if (!published) {
    throw { status: 403, message: 'Hall tickets are not yet published for this exam' };
  }

  return row;
};

const resolvePrincipalSignatureFields = async (includePrincipalSignature) => {
  const sig = await getPrincipalSignatureForHallTicket(includePrincipalSignature === true);
  return {
    include_principal_signature: sig.requested,
    principal_signature_src: sig.found ? sig.embedSrc : null,
    principal_signature_mime: sig.found ? sig.mimeType : null,
    principal_signature_message: sig.message,
  };
};

const persistHallTicketRecord = async ({
  row,
  filePath,
  fileName,
  downloadUrl,
  existingRecords,
}) => {
  const now = new Date();
  const ticket_id = crypto.randomUUID();

  if (existingRecords?.length > 0) {
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
        student_id: row.sid,
        exam_reg_id: row.exam_reg_id || null,
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

  return { ticket_id, generated_at: now };
};

const parseInstructions = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * COE generation: prefer event settings; fallback to legacy global row (is_enabled).
 * @param {string} [eventId]
 * @param {{ skipDateWindowCheck?: boolean }} [options]
 */
const resolveHallTicketGenerationContext = async (eventId, options = {}) => {
  let instructions = [];

  if (eventId) {
    const eventSettings = await hallTicketSettingsService.getHallTicketSettingsByEventId(eventId);
    if (eventSettings) {
      const status =
        eventSettings.hall_ticket_status ||
        (eventSettings.is_enabled ? 'enabled' : 'disabled');
      if (status !== 'enabled') {
        throw { status: 403, message: 'Hall ticket generation is disabled for this exam event' };
      }
      if (!options.isStudentPortal && !options.skipDateWindowCheck) {
        assertHallTicketAvailability(eventSettings, options);
      }
      return { instructions: parseInstructions(eventSettings.instructions) };
    }
  }

  const settingsRows = await db.sequelize.query(
    `SELECT is_enabled, instructions, hall_ticket_status, release_date, download_last_date
     FROM hall_ticket_settings
     WHERE exam_event_id IS NULL OR is_enabled = 1
     ORDER BY is_enabled DESC, updatedAt DESC
     LIMIT 1`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );

  if (settingsRows.length === 0 || !settingsRows[0].is_enabled) {
    throw { status: 403, message: 'Hall ticket generation is currently disabled' };
  }

  const settings = hallTicketSettingsService.normalizeSettingsRow(settingsRows[0]);
  const enabled =
    settings.hall_ticket_status === 'enabled' || settings.is_enabled;
  if (!enabled) {
    throw { status: 403, message: 'Hall ticket generation is currently disabled' };
  }

  if (!options.skipDateWindowCheck && (settings.release_date || settings.download_last_date)) {
    assertHallTicketAvailability(settings, options);
  }

  instructions = parseInstructions(settings.instructions);
  return { instructions };
};

const fileExistsAndValid = (filePath) => {
  try {
    return filePath && fs.existsSync(filePath) && fs.statSync(filePath).size > 100;
  } catch {
    return false;
  }
};

const downloadHallTicket = async (validated, options = {}) => {
  const { studentId, eventId } = validated;
  const isStudentPortal = options.isStudentPortal === true;
  const forceRegenerate = isStudentPortal ? false : options.forceRegenerate === true;
  const skipDateWindowCheck = isStudentPortal ? true : options.skipDateWindowCheck !== false;
  const includePrincipalSignature = options.includePrincipalSignature !== false;

  if (isStudentPortal) {
    if (!eventId) {
      throw { status: 400, message: 'event_id is required for student hall ticket download' };
    }
    await assertStudentHallTicketPublished(studentId, eventId);
    const portalSettings =
      await hallTicketSettingsService.getHallTicketSettingsByEventId(eventId);
    const downloadLastDate = portalSettings?.download_last_date;
    if (downloadLastDate && !isOnOrBeforeDownloadLastDate(downloadLastDate)) {
      const [eventRow] = await db.sequelize.query(
        `SELECT event_name FROM exam_event WHERE event_id = :eventId AND deletedAt IS NULL LIMIT 1`,
        {
          replacements: { eventId },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );
      throw {
        status: 403,
        message: formatDownloadWindowClosedMessage(
          eventRow?.event_name,
          downloadLastDate
        ),
      };
    }
  }

  const { instructions } = await resolveHallTicketGenerationContext(eventId, {
    skipDateWindowCheck,
    isStudentPortal,
  });

  const rows = await queryHallTicketRegistration(studentId, eventId || null);

  if (!rows || rows.length === 0) {
    throw { status: 404, message: 'No confirmed exam registration found' };
  }

  const row = rows[0];

  const [holdRow] = await db.sequelize.query(
    `SELECT COALESCE(er.hall_ticket_hold_override, 0) AS hall_ticket_hold_override,
            ht.is_blocked, ht.block_reason
     FROM exam_registration er
     LEFT JOIN hall_tickets ht ON ht.exam_reg_id = er.exam_reg_id AND ht.deletedAt IS NULL
     WHERE er.exam_reg_id = :exam_reg_id LIMIT 1`,
    {
      replacements: { exam_reg_id: row.exam_reg_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (holdRow?.is_blocked && !holdRow.hall_ticket_hold_override) {
    throw {
      status: 403,
      message: holdRow.block_reason || 'Hall ticket is on hold',
    };
  }

  const existingQuery = eventId
    ? `SELECT * FROM hall_tickets
       WHERE student_id = :studentId AND exam_reg_id IN (
         SELECT exam_reg_id FROM exam_registration WHERE sid = :studentId AND event_id = :eventId
       ) AND deletedAt IS NULL
       ORDER BY generated_at DESC LIMIT 1`
    : `SELECT * FROM hall_tickets
       WHERE student_id = :studentId AND deletedAt IS NULL
       ORDER BY generated_at DESC LIMIT 1`;

  const existingRecords = await db.sequelize.query(existingQuery, {
    replacements: { studentId, eventId },
    type: db.Sequelize.QueryTypes.SELECT,
  });

  const expectedStorage = resolveHallTicketStorage({
    branch_code: row.branch_code,
    branch_name: row.branch_name,
    stud_clg_id: row.stud_clg_id,
    sid: row.sid,
  });

  let filePathToStream;
  let fileNameToStream = expectedStorage.fileName;
  let pdf_url = expectedStorage.downloadUrl;
  let ticket_id = null;

  const existingRecord =
    existingRecords && existingRecords.length > 0 ? existingRecords[0] : null;
  const diskFileReady = fileExistsAndValid(expectedStorage.filePath);
  const dbFileReady =
    existingRecord?.file_path && fileExistsAndValid(existingRecord.file_path);
  const existingPathValid = !forceRegenerate && (diskFileReady || dbFileReady);

  if (existingPathValid) {
    filePathToStream = dbFileReady ? existingRecord.file_path : expectedStorage.filePath;
    fileNameToStream =
      existingRecord?.file_name || expectedStorage.fileName;
    pdf_url = existingRecord?.pdf_url || expectedStorage.downloadUrl;
    ticket_id = existingRecord?.ticket_id || null;

    if (isStudentPortal && existingRecord?.student_id !== studentId) {
      throw {
        status: 403,
        message: 'You can only download your own hall ticket',
      };
    }
  } else {
    if (isStudentPortal) {
      throw {
        status: 404,
        message:
          'Hall ticket PDF is not available yet. Please contact the examination office.',
      };
    }

    if (existingRecord) {
      removeStaleHallTicketArtifacts(existingRecord, expectedStorage.filePath);
      const now = new Date();
      await db.sequelize.query(
        `UPDATE hall_tickets SET deletedAt = :now, updatedAt = :now
         WHERE exam_reg_id = :exam_reg_id AND deletedAt IS NULL`,
        {
          replacements: { exam_reg_id: row.exam_reg_id, now },
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    const signatureFields = await resolvePrincipalSignatureFields(includePrincipalSignature);
    const studentData = buildStudentPdfPayload(row, instructions, signatureFields);
    let filePath;
    let fileName;
    let downloadUrl;

    try {
      ({ filePath, fileName, downloadUrl } = await generateHallTicketPdf(studentData));
    } catch (pdfErr) {
      console.error('[hall_ticket] generateHallTicketPdf failed:', pdfErr);
      if (pdfErr?.name === 'ZodError' || pdfErr?.issues) {
        throw {
          status: 400,
          message: 'Invalid hall ticket data for PDF generation',
          details: pdfErr.issues || pdfErr.errors,
        };
      }
      throw pdfErr.status
        ? pdfErr
        : { status: 500, message: pdfErr.message || 'Failed to generate hall ticket PDF' };
    }

    filePathToStream = filePath;
    fileNameToStream = fileName;
    pdf_url = downloadUrl;

    if (!fileExistsAndValid(filePathToStream)) {
      throw { status: 500, message: 'Hall ticket PDF was not saved to disk' };
    }

    const persisted = await persistHallTicketRecord({
      row,
      filePath,
      fileName,
      downloadUrl,
      existingRecords: existingRecord ? [existingRecord] : [],
    });
    ticket_id = persisted.ticket_id;
  }

  return {
    filePathToStream,
    fileNameToStream,
    pdf_url,
    ticket_id,
    student_id: row.sid,
    exam_reg_id: row.exam_reg_id,
    enrollment_no: row.stud_clg_id,
    student_name: buildStudentPdfPayload(row, instructions).student_name,
    branch_code: row.branch_code,
    branch_name: row.branch_name,
    file_path: filePathToStream,
  };
};

/**
 * Generate/download hall ticket PDFs for all eligible students on an exam event
 * (same pipeline as downloadHallTicket per student).
 * @param {{ eventId: string }} validated
 * @returns {Promise<{ generated_count: number, results: object[] }>}
 */
const downloadHallTicketBulk = async (validated) => {
  const { eventId, include_principal_signature: includePrincipalSignature = true } = validated;

  if (!eventId) {
    throw { status: 400, message: 'exam_event_id is required' };
  }

  const { students } = await getStudentsEligibility({
    exam_event_id: eventId,
    eligibility_status: 'eligible',
  });

  const eligible = students.filter(
    (s) => s.student_id && s.eligibility === 'Eligible' && !s.on_hold
  );

  if (!eligible.length) {
    throw { status: 404, message: 'No eligible students found for this exam event' };
  }

  const results = [];
  let generated_count = 0;

  for (const student of eligible) {
    try {
      const ticket = await downloadHallTicket(
        {
          studentId: student.student_id,
          eventId,
        },
        {
          skipDateWindowCheck: true,
          forceRegenerate: true,
          includePrincipalSignature,
        }
      );

      if (!fileExistsAndValid(ticket.filePathToStream)) {
        throw new Error('PDF file missing after generation');
      }

      generated_count += 1;
      results.push({
        student_id: ticket.student_id,
        exam_reg_id: ticket.exam_reg_id,
        student_name: ticket.student_name || student.student_name,
        enrollment_no: ticket.enrollment_no || student.enrollment_no,
        ticket_id: ticket.ticket_id,
        file_name: ticket.fileNameToStream,
        file_path: ticket.file_path,
        pdf_url: ticket.pdf_url,
        branch_code: ticket.branch_code,
        branch_name: ticket.branch_name,
        success: true,
      });
    } catch (err) {
      results.push({
        student_id: student.student_id,
        student_name: student.student_name,
        enrollment_no: student.enrollment_no,
        success: false,
        error: err.message || 'Download failed',
      });
    }
  }

  return { generated_count, results };
};

module.exports = {
  getHallTicketSettings,
  updateHallTicketSettings,
  downloadHallTicket,
  downloadHallTicketBulk,
};
