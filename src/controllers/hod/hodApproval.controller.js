const db = require('../../models');

const getDepartmentSubjects = async (req, res) => {
  try {
    const user_id = req.user.uid;

    // 1. Find the HOD's depart_id
    const hod = await db.hod.findOne({ where: { user_id, is_deleted: false } });
    if (!hod) {
      return res.status(403).json({ success: false, message: 'HOD profile not found for the logged-in user.' });
    }

    const depart_id = hod.depart_id;

    // 2. Fetch all subjects mapped in the current semester structure for this department
    const query = `
      SELECT 
        sub.subject_code,
        sub.subject_name,
        ssm.mapping_id,
        sem.semester_number,
        fac.name as faculty_name,
        me.component,
        MAX(me.is_locked) as is_locked,
        MAX(me.is_approved) as is_approved
      FROM subject sub
      JOIN semester_subject_mapping ssm ON sub.subject_id = ssm.subject_id
      JOIN semester sem ON ssm.semester_id = sem.semester_id
      LEFT JOIN faculty_subject_mapping fsm ON ssm.subject_id = fsm.subject_id AND ssm.semester_id = fsm.semester_id AND fsm.deletedAt IS NULL
      LEFT JOIN faculty fac ON fsm.faculty_id = fac.faculty_id 
      LEFT JOIN registration_subject rs ON ssm.mapping_id = rs.mapping_id
      LEFT JOIN marks_entry me ON rs.reg_subj_id = me.reg_subj_id
      WHERE sub.depart_id = :depart_id AND ssm.deleted_at IS NULL
      GROUP BY sub.subject_code, sub.subject_name, ssm.mapping_id, sem.semester_number, fac.name, me.component
    `;

    const rawSubjects = await db.sequelize.query(query, {
      replacements: { depart_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // We filter out rows where component is null, or map them as Pending Faculty if component is null 
    // but the subject is assigned. We want to return a list of tasks for the HOD.
    // If component is not null, status is evaluated.
    
    const formattedData = rawSubjects.filter(r => r.component).map(r => {
      let status = 'Pending Faculty';
      if (r.is_approved === 1 || r.is_approved === true) {
        status = 'Approved';
      } else if (r.is_locked === 1 || r.is_locked === true) {
        status = 'Locked/Ready for Review';
      }

      return {
        ...r,
        status
      };
    });

    return res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching department subjects:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getLockedRoster = async (req, res) => {
  try {
    const { mapping_id, component } = req.params;

    const query = `
      SELECT 
        rs.reg_subj_id,
        s.stud_clg_id AS PRN,
        spd.name AS student_name,
        me.marks_obtained,
        me.max_marks,
        me.is_locked,
        me.is_approved
      FROM registration_subject rs
      JOIN exam_registration er ON rs.exam_reg_id = er.exam_reg_id
      JOIN students s ON er.sid = s.sid
      JOIN student_personaldetails spd ON s.sid = spd.stud_id
      JOIN marks_entry me ON rs.reg_subj_id = me.reg_subj_id AND me.component = :component
      WHERE rs.mapping_id = :mapping_id
      ORDER BY s.stud_clg_id ASC
    `;

    const roster = await db.sequelize.query(query, {
      replacements: { mapping_id, component },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({ success: true, data: roster });
  } catch (error) {
    console.error('Error fetching locked roster:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const approveMarks = async (req, res) => {
  try {
    const { mapping_id, component } = req.body;
    const user_id = req.user.uid;

    const query = `
      UPDATE marks_entry me
      JOIN registration_subject rs ON me.reg_subj_id = rs.reg_subj_id
      SET me.is_approved = 1, me.approved_at = NOW(), me.approved_by = :user_id
      WHERE rs.mapping_id = :mapping_id AND me.component = :component AND me.is_locked = 1
    `;

    await db.sequelize.query(query, {
      replacements: { mapping_id, component, user_id },
      type: db.Sequelize.QueryTypes.UPDATE
    });

    return res.status(200).json({ success: true, message: 'Marks approved successfully' });
  } catch (error) {
    console.error('Error approving marks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const unlockMarks = async (req, res) => {
  try {
    const { mapping_id, component } = req.body;

    const query = `
      UPDATE marks_entry me
      JOIN registration_subject rs ON me.reg_subj_id = rs.reg_subj_id
      SET me.is_locked = 0, me.locked_at = NULL, me.locked_by = NULL, me.is_approved = 0, me.approved_at = NULL, me.approved_by = NULL
      WHERE rs.mapping_id = :mapping_id AND me.component = :component
    `;

    await db.sequelize.query(query, {
      replacements: { mapping_id, component },
      type: db.Sequelize.QueryTypes.UPDATE
    });

    return res.status(200).json({ success: true, message: 'Marks unlocked successfully' });
  } catch (error) {
    console.error('Error unlocking marks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getDepartmentSubjects,
  getLockedRoster,
  approveMarks,
  unlockMarks
};
