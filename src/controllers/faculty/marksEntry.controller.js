const db = require('../../../models');

const getAssignedSubjects = async (req, res) => {
  try {
    const faculty_id = req.user.uid;

    const query = `
      SELECT 
        ssm.mapping_id,
        sub.subject_id,
        sub.subject_name,
        sub.subject_code,
        sub.max_theory,
        sub.max_practical,
        sub.max_tw,
        sub.max_oral,
        sem.semester_number
      FROM faculty_subject_mapping fsm
      JOIN semester_subject_mapping ssm 
        ON fsm.subject_id = ssm.subject_id AND fsm.semester_id = ssm.semester_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      JOIN semester sem ON sub.semester_id = sem.semester_id
      WHERE fsm.faculty_id = :faculty_id AND fsm.deletedAt IS NULL AND ssm.deleted_at IS NULL
      GROUP BY ssm.mapping_id
    `;

    const subjects = await db.sequelize.query(query, {
      replacements: { faculty_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    console.error('Error fetching assigned subjects:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMarksRoster = async (req, res) => {
  try {
    const { mapping_id, component } = req.params;

    // Join registration_subject -> exam_registration -> students -> student_personaldetails
    // LEFT JOIN marks_entry on reg_subj_id and component
    const query = `
      SELECT 
        rs.reg_subj_id,
        s.stud_clg_id AS PRN,
        spd.name AS student_name,
        me.marks_obtained,
        me.max_marks,
        me.is_locked
      FROM registration_subject rs
      JOIN exam_registration er ON rs.exam_reg_id = er.exam_reg_id
      JOIN students s ON er.sid = s.sid
      JOIN student_personaldetails spd ON s.sid = spd.stud_id
      LEFT JOIN marks_entry me ON rs.reg_subj_id = me.reg_subj_id AND me.component = :component
      WHERE rs.mapping_id = :mapping_id
      ORDER BY s.stud_clg_id ASC
    `;

    const roster = await db.sequelize.query(query, {
      replacements: { mapping_id, component },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({ success: true, data: roster });
  } catch (error) {
    console.error('Error fetching marks roster:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const saveMarksDraft = async (req, res) => {
  try {
    const { mapping_id, component, marks_data } = req.body;
    // marks_data is array of { reg_subj_id, marks_obtained, max_marks }
    const faculty_id = req.user.uid;

    for (const record of marks_data) {
      const existing = await db.marks_entry.findOne({
        where: { reg_subj_id: record.reg_subj_id, component }
      });

      if (existing) {
        if (existing.is_locked) {
          return res.status(403).json({ success: false, message: `Marks for ${component} are locked and cannot be modified.` });
        }
        await existing.update({
          marks_obtained: record.marks_obtained,
          max_marks: record.max_marks,
          faculty_id
        });
      } else {
        await db.marks_entry.create({
          reg_subj_id: record.reg_subj_id,
          faculty_id,
          component,
          marks_obtained: record.marks_obtained,
          max_marks: record.max_marks,
          is_locked: false
        });
      }
    }

    return res.status(200).json({ success: true, message: 'Draft saved successfully' });
  } catch (error) {
    console.error('Error saving marks draft:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const lockMarks = async (req, res) => {
  try {
    const { mapping_id, component } = req.body;
    const faculty_id = req.user.uid;

    // To lock, we need to find all marks_entry for this mapping_id and component
    // But marks_entry links via reg_subj_id.
    const query = `
      UPDATE marks_entry me
      JOIN registration_subject rs ON me.reg_subj_id = rs.reg_subj_id
      SET me.is_locked = 1, me.locked_at = NOW(), me.locked_by = :faculty_id
      WHERE rs.mapping_id = :mapping_id AND me.component = :component AND me.is_locked = 0
    `;

    await db.sequelize.query(query, {
      replacements: { mapping_id, component, faculty_id },
      type: db.Sequelize.QueryTypes.UPDATE
    });

    return res.status(200).json({ success: true, message: 'Marks locked successfully' });
  } catch (error) {
    console.error('Error locking marks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAssignedSubjects,
  getMarksRoster,
  saveMarksDraft,
  lockMarks
};
