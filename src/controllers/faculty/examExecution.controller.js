const db = require('../../models');

const getBlockRoster = async (req, res) => {
  try {
    const { timetable_id, room_id } = req.query;

    const query = `
      SELECT 
        ss.seating_id,
        ss.seat_no,
        s.stud_clg_id AS PRN,
        spd.name AS student_name,
        COALESCE(ar.is_present, 1) AS is_present
      FROM student_seating ss
      JOIN block_allocation ba ON ss.block_id = ba.block_id
      JOIN exam_registration er ON ss.exam_reg_id = er.exam_reg_id
      JOIN students s ON er.sid = s.sid
      JOIN student_personaldetails spd ON s.sid = spd.stud_id
      LEFT JOIN attendance_record ar ON ss.seating_id = ar.seating_id
      WHERE ba.timetable_id = :timetable_id AND ba.room_id = :room_id AND ss.deletedAt IS NULL
      ORDER BY ss.seat_no ASC
    `;

    const roster = await db.sequelize.query(query, {
      replacements: { timetable_id, room_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({ success: true, data: roster });
  } catch (error) {
    console.error('Error in getBlockRoster:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const submitAttendance = async (req, res) => {
  try {
    const { block_id, attendance_data } = req.body;
    const faculty_uid = req.user.uid; 

    for (const record of attendance_data) {
      const existing = await db.attendance_record.findOne({ where: { seating_id: record.seating_id } });
      if (existing) {
        await existing.update({ is_present: record.is_present, submitted_by: faculty_uid, submitted_at: new Date() });
      } else {
        await db.attendance_record.create({
          seating_id: record.seating_id,
          is_present: record.is_present,
          submitted_by: faculty_uid,
          submitted_at: new Date()
        });
      }
    }

    return res.status(200).json({ success: true, message: 'Attendance submitted successfully' });
  } catch (error) {
    console.error('Error in submitAttendance:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const reportCopyCase = async (req, res) => {
  try {
    const { seating_id, incident_description } = req.body;
    const faculty_uid = req.user.uid;

    const seatInfoQuery = `
      SELECT ss.seat_no, ss.block_id, er.sid
      FROM student_seating ss
      JOIN exam_registration er ON ss.exam_reg_id = er.exam_reg_id
      WHERE ss.seating_id = :seating_id
      LIMIT 1
    `;
    const [seatInfo] = await db.sequelize.query(seatInfoQuery, {
      replacements: { seating_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    if (!seatInfo) {
      return res.status(404).json({ success: false, message: 'Seating record not found' });
    }

    await db.copy_case.create({
      seating_id: seating_id,
      sid: seatInfo.sid,
      seat_no: seatInfo.seat_no,
      incident_description,
      supervisor_id: faculty_uid,
      case_status: 'new'
    });

    return res.status(201).json({ success: true, message: 'Copy case reported successfully' });
  } catch (error) {
    console.error('Error in reportCopyCase:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getBlockRoster,
  submitAttendance,
  reportCopyCase
};
