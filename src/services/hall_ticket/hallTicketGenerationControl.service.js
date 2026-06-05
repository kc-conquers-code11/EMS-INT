const db = require('../../../models');
const hallTicketSettingsService = require('./hallTicketSettings.service');

/**
 * Derive UI-friendly eligibility and hold state for hall ticket generation/download.
 * @param {object} row
 * @returns {object}
 */
const deriveEligibility = (row) => {
  const registrationStatus =
    row.reg_status === 'confirmed'
      ? 'Completed'
      : row.reg_status === 'payment_pending'
        ? 'Payment Pending'
        : row.reg_status || 'Pending';

  const feesStatus =
    row.payment_status === 'completed' ? 'Confirmed' : 'Pending';

  const approval = row.approved_at ? 'Approved' : 'Pending';

  if (row.hall_ticket_hold_override) {
    return {
      eligibility: 'Eligible',
      reason: 'Hold removed by COE',
      registration_status: registrationStatus,
      fees_status: feesStatus,
      approval: row.approved_at ? 'Approved' : approval,
      on_hold: false,
      can_generate: true,
      can_download: true,
    };
  }

  let reason = '-';
  let eligibility = 'Eligible';

  if (row.reg_status !== 'confirmed') {
    eligibility = 'Not Eligible';
    reason = 'Registration not confirmed';
  } else if (row.payment_status !== 'completed') {
    eligibility = 'Not Eligible';
    reason = 'Fee pending';
  } else if (!row.approved_at && (row.reg_type === 'late' || row.reg_type === 'backlog')) {
    eligibility = 'Not Eligible';
    reason = 'No approval';
  } else if (row.is_blocked) {
    eligibility = 'Not Eligible';
    reason = row.block_reason || 'Hall ticket on hold';
  }

  const on_hold = eligibility === 'Not Eligible' || row.is_blocked === 1;

  return {
    eligibility,
    reason,
    registration_status: registrationStatus,
    fees_status: feesStatus,
    approval,
    on_hold,
    can_generate: !on_hold,
    can_download: !on_hold,
  };
};

/**
 * Set or clear hall ticket hold override for a registration (COE "Remove Hold").
 * @param {string} exam_reg_id
 * @param {boolean} on_hold - false clears hold and allows download again
 * @returns {Promise<object>}
 */
const setStudentHallTicketHold = async (exam_reg_id, on_hold) => {
  const rows = await db.sequelize.query(
    `SELECT exam_reg_id, sid, event_id FROM exam_registration WHERE exam_reg_id = :exam_reg_id LIMIT 1`,
    {
      replacements: { exam_reg_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!rows.length) {
    throw { status: 404, message: 'Exam registration not found' };
  }

  const now = new Date();

  if (!on_hold) {
    await db.sequelize.query(
      `UPDATE exam_registration
       SET hall_ticket_hold_override = 1, updatedAt = :now
       WHERE exam_reg_id = :exam_reg_id`,
      {
        replacements: { exam_reg_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    await db.sequelize.query(
      `UPDATE hall_tickets
       SET is_blocked = 0, block_reason = NULL, updatedAt = :now
       WHERE exam_reg_id = :exam_reg_id AND deletedAt IS NULL`,
      {
        replacements: { exam_reg_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  } else {
    await db.sequelize.query(
      `UPDATE exam_registration
       SET hall_ticket_hold_override = 0, updatedAt = :now
       WHERE exam_reg_id = :exam_reg_id`,
      {
        replacements: { exam_reg_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    await db.sequelize.query(
      `UPDATE hall_tickets
       SET is_blocked = 1, block_reason = 'Placed on hold by COE', updatedAt = :now
       WHERE exam_reg_id = :exam_reg_id AND deletedAt IS NULL`,
      {
        replacements: { exam_reg_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  }

  return { exam_reg_id, on_hold };
};

/**
 * Distinct branch and semester labels for autocomplete filters.
 * @param {string} exam_event_id
 * @returns {Promise<{ branches: string[], semesters: string[] }>}
 */
const getEligibilityFilterOptions = async (exam_event_id) => {
  if (!exam_event_id) {
    return { branches: [], semesters: [] };
  }

  const branchRows = await db.sequelize.query(
    `SELECT DISTINCT b.branch_id, b.branch_name
     FROM exam_registration er
     INNER JOIN students s ON s.sid = er.sid
     INNER JOIN branch b ON b.branch_id = s.branch_id
     WHERE er.event_id = :exam_event_id AND b.branch_name IS NOT NULL
     ORDER BY b.branch_name ASC`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const semesterRows = await db.sequelize.query(
    `SELECT DISTINCT sem.semester_id, sem.semester_number, sem.term_type
     FROM exam_registration er
     LEFT JOIN exam_event ee ON ee.event_id = er.event_id
     LEFT JOIN semester sem ON sem.semester_id = ee.semester_id
     WHERE er.event_id = :exam_event_id AND sem.semester_number IS NOT NULL
     ORDER BY sem.semester_number ASC`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    branches: branchRows.map((r) => ({
      branch_id: r.branch_id,
      branch_name: r.branch_name,
      label: r.branch_name,
    })),
    semesters: semesterRows.map((r) => ({
      semester_id: r.semester_id,
      semester_number: r.semester_number,
      term_type: r.term_type,
      label: r.term_type
        ? `Semester ${r.semester_number} (${r.term_type})`
        : `Semester ${r.semester_number}`,
    })),
  };
};

/**
 * List students with eligibility for hall ticket generation (application-level merge).
 * @param {{ exam_event_id?: string, eligibility_status?: string, branch?: string, semester?: string }} filters
 * @returns {Promise<{ exam_events: object[], settings: object|null, students: object[] }>}
 */
const getHallTicketGenerationControlData = async (filters = {}) => {
  const { exam_event_id, eligibility_status, branch_id, semester_id } = filters;

  let eventWhere = 'ee.deletedAt IS NULL';
  const eventReplacements = {};

  if (exam_event_id) {
    eventWhere += ' AND ee.event_id = :exam_event_id';
    eventReplacements.exam_event_id = exam_event_id;
  }

  const examEvents = await db.sequelize.query(
    `SELECT ee.event_id, ee.event_name, ee.exam_type, ee.status, ee.semester_id
     FROM exam_event ee
     WHERE ${eventWhere}
     ORDER BY ee.createdAt DESC`,
    {
      replacements: eventReplacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  let settings = null;
  if (exam_event_id) {
    settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(exam_event_id);
  }

  const { students } = await getStudentsEligibility({
    exam_event_id,
    eligibility_status,
    branch_id,
    semester_id,
  });

  return {
    exam_events: examEvents,
    settings,
    students,
  };
};

/**
 * Fetch student eligibility rows for the Students Eligibility tab.
 * @param {{ exam_event_id?: string, eligibility_status?: string, branch?: string, semester?: string }} filters
 * @returns {Promise<{ students: object[] }>}
 */
const getStudentsEligibility = async (filters = {}) => {
  const { exam_event_id, eligibility_status, branch_id, semester_id } = filters;

  if (!exam_event_id) {
    return { students: [] };
  }

  let regWhere = 'er.event_id = :exam_event_id';
  const replacements = { exam_event_id };

  if (branch_id) {
    regWhere += ' AND s.branch_id = :branch_id';
    replacements.branch_id = branch_id;
  }

  if (semester_id) {
    regWhere += ' AND ee.semester_id = :semester_id';
    replacements.semester_id = semester_id;
  }

  const registrationRows = await db.sequelize.query(
    `SELECT
      er.exam_reg_id,
      er.sid AS student_id,
      er.reg_status,
      er.reg_type,
      er.payment_status,
      er.approved_at,
      COALESCE(er.hall_ticket_hold_override, 0) AS hall_ticket_hold_override,
      s.stud_clg_id,
      spd.first_name,
      spd.last_name,
      spd.name,
      b.branch_name,
      b.branch_id,
      d.depart_name AS department_name,
      ee.event_id,
      ee.event_name,
      ee.semester_id,
      sem.semester_number,
      sem.term_type,
      ht.is_blocked,
      ht.block_reason
    FROM exam_registration er
    LEFT JOIN students s ON s.sid = er.sid
    LEFT JOIN student_personaldetails spd ON spd.stud_id = er.sid
    LEFT JOIN branch b ON b.branch_id = s.branch_id
    LEFT JOIN department d ON d.depart_id = b.depart_id
    LEFT JOIN exam_event ee ON ee.event_id = er.event_id
    LEFT JOIN semester sem ON sem.semester_id = ee.semester_id
    LEFT JOIN hall_tickets ht ON ht.exam_reg_id = er.exam_reg_id AND ht.deletedAt IS NULL
    WHERE ${regWhere}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const dedupedRows = [];
  const seenStudentIds = new Set();
  for (const row of registrationRows) {
    if (!row.student_id || seenStudentIds.has(row.student_id)) continue;
    seenStudentIds.add(row.student_id);
    dedupedRows.push(row);
  }

  const students = dedupedRows.map((row) => {
    const derived = deriveEligibility(row);
    const studentName =
      `${row.first_name || ''} ${row.last_name || ''}`.trim() ||
      row.name ||
      '-';

    return {
      student_id: row.student_id,
      exam_reg_id: row.exam_reg_id,
      enrollment_no: row.stud_clg_id || '-',
      student_name: studentName,
      registration_status: derived.registration_status,
      fees_status: derived.fees_status,
      approval: derived.approval,
      eligibility: derived.eligibility,
      reason: derived.reason,
      on_hold: derived.on_hold,
      can_generate: derived.can_generate,
      can_download: derived.can_download,
      event_id: row.event_id,
      event_name: row.event_name || '-',
      branch: row.branch_name || '-',
      branch_id: row.branch_id,
      department: row.department_name || '-',
      semester_id: row.semester_id,
      semester: row.semester_number
        ? `Semester ${row.semester_number}${row.term_type ? ` (${row.term_type})` : ''}`
        : '-',
    };
  });

  let filtered = students;
  if (eligibility_status === 'eligible') {
    filtered = students.filter((s) => !s.on_hold);
  } else if (eligibility_status === 'not-eligible') {
    filtered = students.filter((s) => s.on_hold);
  }

  return { students: filtered };
};

module.exports = {
  deriveEligibility,
  setStudentHallTicketHold,
  getEligibilityFilterOptions,
  getHallTicketGenerationControlData,
  getStudentsEligibility,
};
