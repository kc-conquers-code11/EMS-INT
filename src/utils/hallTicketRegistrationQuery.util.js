const db = require('../../models');

/**
 * Shared hall ticket registration + subject schedule query (exam_registration → timetable).
 * Keeps generate and download paths aligned on subject_code, subject_name, exam_date, exam_time.
 */
const HALL_TICKET_REGISTRATION_SQL = `
  SELECT
    er.exam_reg_id, er.sid, er.reg_status, er.event_id,
    ee.event_name, ee.exam_type, ee.exam_date, ee.exam_time,
    spd.first_name, spd.last_name, spd.name,
    s.stud_clg_id, s.academic_year,
    p.programme_name,
    b.branch_name,
    b.branch_code,
    sem.semester_number, sem.term_type,
    seat.seat_no,
    JSON_ARRAYAGG(
      IF(
        sub.subject_id IS NOT NULL,
        JSON_OBJECT(
          'subject_code', sub.subject_code,
          'subject_name', sub.subject_name,
          'exam_date', t.exam_date,
          'exam_time', ts.start_time
        ),
        NULL
      )
    ) AS exam_schedule
  FROM exam_registration er
  INNER JOIN exam_event ee ON er.event_id = ee.event_id
  INNER JOIN student_personaldetails spd ON spd.stud_id = er.sid
  LEFT JOIN students s ON s.sid = er.sid
  LEFT JOIN programme p ON p.programm_id = s.program_id
  LEFT JOIN branch b ON b.branch_id = s.branch_id
  LEFT JOIN semester sem ON sem.semester_id = ee.semester_id
  LEFT JOIN student_seating seat ON seat.exam_reg_id = er.exam_reg_id
  LEFT JOIN registration_subject rs ON rs.exam_reg_id = er.exam_reg_id
  LEFT JOIN semester_subject_mapping ssm ON ssm.mapping_id = rs.mapping_id
  LEFT JOIN subject sub ON sub.subject_id = ssm.subject_id
  LEFT JOIN timetable t ON t.mapping_id = ssm.mapping_id AND t.event_id = ee.event_id
  LEFT JOIN time_slot ts ON ts.slot_id = t.slot_id
  WHERE er.sid = :studentId AND er.reg_status = 'confirmed'
`;

const HALL_TICKET_REGISTRATION_GROUP_BY = `
  GROUP BY
    er.exam_reg_id, er.sid, er.reg_status, er.event_id,
    ee.event_name, ee.exam_type, ee.exam_date, ee.exam_time,
    spd.first_name, spd.last_name, spd.name,
    s.stud_clg_id, s.academic_year,
    p.programme_name, b.branch_name, b.branch_code,
    sem.semester_number, sem.term_type, seat.seat_no
`;

/**
 * @param {string} studentId
 * @param {string|null|undefined} eventId
 * @returns {Promise<object[]>}
 */
const queryHallTicketRegistration = async (studentId, eventId = null) => {
  const eventClause = eventId ? ' AND er.event_id = :eventId' : '';
  return db.sequelize.query(
    `${HALL_TICKET_REGISTRATION_SQL}${eventClause}${HALL_TICKET_REGISTRATION_GROUP_BY}`,
    {
      replacements: { studentId, eventId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
};

module.exports = {
  queryHallTicketRegistration,
};
