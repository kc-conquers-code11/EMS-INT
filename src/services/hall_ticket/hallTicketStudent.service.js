const fs = require('fs');
const db = require('../../../models');
const hallTicketSettingsService = require('./hallTicketSettings.service');
const hallTicketGenerateService = require('./hallTicketGenerate.service');
const { deriveEligibility } = require('./hallTicketGenerationControl.service');
const { resolveHallTicketStorage } = require('../../helpers/hallTicket.helper');
const { isOnOrBeforeDownloadLastDate } = require('../../utils/hallTicketDate.util');
const {
  formatDisplayDate,
  formatDisplayTime,
  formatDownloadWindowClosedMessage,
} = require('../../utils/hallTicketDisplay.util');

/**
 * Resolve student sid from authenticated user uid.
 * @param {string} uid
 * @returns {Promise<string>}
 */
const getStudentIdByUid = async (uid) => {
  const rows = await db.sequelize.query(
    `SELECT sid FROM students WHERE uid = :uid LIMIT 1`,
    {
      replacements: { uid },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!rows.length) {
    throw { status: 404, message: 'Student profile not found' };
  }

  return rows[0].sid;
};

/**
 * Student hall ticket view for portal (latest published event with enabled settings).
 * @param {string} uid
 * @param {string} [eventId]
 * @returns {Promise<object>}
 */
const getStudentHallTicketView = async (uid, eventId) => {
  const studentId = await getStudentIdByUid(uid);

  let eventFilter = '';
  const replacements = { studentId };

  if (eventId) {
    eventFilter = 'AND er.event_id = :eventId';
    replacements.eventId = eventId;
  }

  const registrations = await db.sequelize.query(
    `SELECT
      er.exam_reg_id,
      er.sid,
      er.event_id,
      er.reg_status,
      er.reg_type,
      er.payment_status,
      er.approved_at,
      COALESCE(er.hall_ticket_hold_override, 0) AS hall_ticket_hold_override,
      ee.event_name,
      ee.is_published,
      ht.ticket_id,
      ht.student_id AS ticket_student_id,
      ht.is_blocked,
      ht.block_reason,
      ht.file_path AS ticket_file_path,
      ht.file_name AS ticket_file_name,
      hts.hall_ticket_status,
      hts.release_date,
      hts.download_last_date
    FROM exam_registration er
    INNER JOIN exam_event ee ON ee.event_id = er.event_id AND ee.deletedAt IS NULL
    LEFT JOIN hall_ticket_settings hts ON hts.exam_event_id = er.event_id
    LEFT JOIN hall_tickets ht ON ht.student_id = er.sid
      AND ht.exam_reg_id = er.exam_reg_id
      AND ht.deletedAt IS NULL
    WHERE er.sid = :studentId AND er.reg_status = 'confirmed'
    ${eventFilter}
    ORDER BY er.registered_at DESC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!registrations.length) {
    throw { status: 404, message: 'No confirmed exam registration found' };
  }

  const isRegistrationPublished = (r) =>
    r.hall_ticket_status === 'enabled' || Number(r.is_published) === 1;

  const row =
    registrations.find(
      (r) => isRegistrationPublished(r) && !deriveEligibility(r).on_hold
    ) ||
    registrations.find((r) => !deriveEligibility(r).on_hold) ||
    registrations[0];

  const derived = deriveEligibility(row);
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(row.event_id);

  const status = settings?.hall_ticket_status || row.hall_ticket_status;
  const published =
    status === 'enabled' || Number(row.is_published) === 1;

  const downloadLastDate =
    settings?.download_last_date || row.download_last_date || null;
  const withinDownloadWindow = isOnOrBeforeDownloadLastDate(downloadLastDate);

  const branchRows = await db.sequelize.query(
    `SELECT s.stud_clg_id, b.branch_code, b.branch_name
     FROM students s
     LEFT JOIN branch b ON b.branch_id = s.branch_id
     WHERE s.sid = :studentId LIMIT 1`,
    {
      replacements: { studentId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  const studMeta = branchRows[0] || {};
  const expectedPath = resolveHallTicketStorage({
    branch_code: studMeta.branch_code,
    branch_name: studMeta.branch_name,
    stud_clg_id: studMeta.stud_clg_id,
    sid: studentId,
  }).filePath;

  const fileValid = (filePath) => {
    try {
      return filePath && fs.existsSync(filePath) && fs.statSync(filePath).size > 100;
    } catch {
      return false;
    }
  };

  const hasTicketRecord =
    !!row.ticket_id && row.ticket_student_id === studentId;

  const ticketFileReady =
    hasTicketRecord &&
    (fileValid(expectedPath) || fileValid(row.ticket_file_path));

  let hallTicket = null;
  let canDownload = false;
  let message = null;

  if (!published) {
    message = 'Hall tickets are not yet published for this exam';
  } else if (derived.on_hold) {
    message = derived.reason || 'Your hall ticket is on hold';
  } else if (!withinDownloadWindow) {
    message = formatDownloadWindowClosedMessage(row.event_name, downloadLastDate);
  } else if (!hasTicketRecord) {
    message =
      'Your hall ticket has not been generated yet. Please contact the examination office.';
    try {
      hallTicket = await hallTicketGenerateService.buildHallTicketPayload(
        studentId,
        row.event_id,
        { skipDateWindowCheck: true, skipStatusCheck: true }
      );
    } catch {
      hallTicket = null;
    }
  } else {
    try {
      hallTicket = await hallTicketGenerateService.buildHallTicketPayload(
        studentId,
        row.event_id,
        { skipDateWindowCheck: true, skipStatusCheck: true }
      );
      canDownload = ticketFileReady && withinDownloadWindow;
      if (!ticketFileReady) {
        message =
          'Hall ticket is published but PDF is not available on disk yet. Please contact the examination office.';
      } else if (!withinDownloadWindow) {
        message = formatDownloadWindowClosedMessage(row.event_name, downloadLastDate);
      }
    } catch (err) {
      message = err.message || 'Hall ticket is not available yet';
    }
  }

  return {
    student_id: studentId,
    event_id: row.event_id,
    event_name: row.event_name,
    exam_reg_id: row.exam_reg_id,
    published,
    on_hold: derived.on_hold,
    reason: derived.reason,
    has_ticket_record: hasTicketRecord,
    can_download:
      canDownload && published && !derived.on_hold && hasTicketRecord && withinDownloadWindow,
    download_last_date: downloadLastDate,
    within_download_window: withinDownloadWindow,
    message,
    hall_ticket: hallTicket
      ? {
          enrollmentId: hallTicket.enrollment_id || '-',
          studentName: hallTicket.student_name || '-',
          branch: hallTicket.branch || '-',
          semester: hallTicket.semester || '-',
          examEvent: hallTicket.exam_event || row.event_name || '-',
          seatNumber: hallTicket.seat_number || 'TBD',
          subjects: (hallTicket.subjects || []).map((s) => ({
            srNo: s.sr_no ?? 0,
            courseCode: s.course_code || '-',
            courseName: s.course_name || '-',
            date: formatDisplayDate(s.date),
            time: formatDisplayTime(s.time),
          })),
        }
      : null,
  };
};

module.exports = {
  getStudentIdByUid,
  getStudentHallTicketView,
};
