const db = require('../../../models');

const getAllCopyCases = async (req, res) => {
  try {
    const query = `
      SELECT 
        cc.case_id,
        cc.case_status,
        cc.incident_description,
        cc.punishment_reason as penalty_applied,
        cc.coe_remark as committee_remarks,
        cc.createdAt as report_date,
        s.stud_clg_id as prn,
        spd.name as student_name,
        sub.subject_code,
        sub.subject_name,
        fac.name as reported_by
      FROM copy_case cc
      LEFT JOIN students s ON cc.sid = s.sid
      LEFT JOIN student_personaldetails spd ON s.sid = spd.stud_id
      LEFT JOIN timetable tt ON cc.timetable_id = tt.timetable_id
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN faculty fac ON cc.supervisor_id = fac.faculty_id
      ORDER BY 
        CASE WHEN cc.case_status = 'PENDING' THEN 1 ELSE 2 END,
        cc.createdAt DESC
    `;

    const cases = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({ success: true, data: cases });
  } catch (error) {
    console.error('Error fetching copy cases:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const resolveCopyCase = async (req, res) => {
  try {
    const { case_id } = req.params;
    const { penalty_applied, committee_remarks } = req.body;

    if (!penalty_applied) {
      return res.status(400).json({ success: false, message: 'Penalty is required to resolve a copy case.' });
    }

    const query = `
      UPDATE copy_case 
      SET 
        case_status = 'RESOLVED',
        punishment_reason = :penalty_applied,
        coe_remark = :committee_remarks
      WHERE case_id = :case_id
    `;

    await db.sequelize.query(query, {
      replacements: { penalty_applied, committee_remarks: committee_remarks || null, case_id },
      type: db.Sequelize.QueryTypes.UPDATE
    });

    return res.status(200).json({ success: true, message: 'Case resolved successfully.' });
  } catch (error) {
    console.error('Error resolving copy case:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllCopyCases,
  resolveCopyCase
};
