const db = require('../../../models');

const getAssignedRevaluations = async (req, res) => {
  try {
    const user_id = req.user.uid;

    const faculty = await db.faculty.findOne({ where: { user_id, deletedAt: null } });
    if (!faculty) {
      return res.status(403).json({ success: false, message: 'Faculty profile not found.' });
    }

    const query = `
      SELECT 
        re.reval_id,
        re.reg_subj_id,
        re.component,
        re.revised_marks,
        re.is_locked,
        re.evaluation_remarks,
        sub.subject_code,
        sub.subject_name,
        me.marks_obtained as original_marks,
        me.max_marks
      FROM revaluation_entry re
      JOIN registration_subject rs ON re.reg_subj_id = rs.reg_subj_id
      JOIN semester_subject_mapping ssm ON rs.mapping_id = ssm.mapping_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      JOIN marks_entry me ON re.reg_subj_id = me.reg_subj_id AND re.component = me.component
      WHERE re.faculty_id = :faculty_id
      ORDER BY sub.subject_code, re.reval_id
    `;

    const rawTasks = await db.sequelize.query(query, {
      replacements: { faculty_id: faculty.faculty_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    const maskedTasks = rawTasks.map(t => ({
      ...t,
      dummy_no: 'REV-' + t.reg_subj_id.slice(-5).toUpperCase()
    }));

    return res.status(200).json({ success: true, data: maskedTasks });
  } catch (error) {
    console.error('Error fetching assigned revaluations:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const saveRevaluationDraft = async (req, res) => {
  try {
    const { evaluations } = req.body; // Array of { reval_id, revised_marks, evaluation_remarks }
    const user_id = req.user.uid;

    const faculty = await db.faculty.findOne({ where: { user_id, deletedAt: null } });
    if (!faculty) {
      return res.status(403).json({ success: false, message: 'Faculty profile not found.' });
    }

    for (const evalData of evaluations) {
      const { reval_id, revised_marks, evaluation_remarks } = evalData;

      const record = await db.sequelize.query(
        'SELECT is_locked, faculty_id FROM revaluation_entry WHERE reval_id = :reval_id',
        { replacements: { reval_id }, type: db.Sequelize.QueryTypes.SELECT }
      );

      if (record.length === 0) continue;
      if (record[0].is_locked === 1 || record[0].is_locked === true) {
        continue; // Skip locked records
      }
      if (record[0].faculty_id !== faculty.faculty_id) {
        continue; // Unauthorized for this record
      }

      await db.sequelize.query(
        'UPDATE revaluation_entry SET revised_marks = :revised_marks, evaluation_remarks = :evaluation_remarks WHERE reval_id = :reval_id',
        {
          replacements: { 
            revised_marks: revised_marks === '' ? null : revised_marks, 
            evaluation_remarks: evaluation_remarks || null, 
            reval_id 
          },
          type: db.Sequelize.QueryTypes.UPDATE
        }
      );
    }

    return res.status(200).json({ success: true, message: 'Drafts saved successfully.' });
  } catch (error) {
    console.error('Error saving revaluation drafts:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const lockRevaluation = async (req, res) => {
  try {
    const { reval_ids } = req.body; // Array of reval_id to lock
    const user_id = req.user.uid;

    const faculty = await db.faculty.findOne({ where: { user_id, deletedAt: null } });
    if (!faculty) {
      return res.status(403).json({ success: false, message: 'Faculty profile not found.' });
    }

    for (const reval_id of reval_ids) {
      const record = await db.sequelize.query(
        'SELECT is_locked, faculty_id, revised_marks FROM revaluation_entry WHERE reval_id = :reval_id',
        { replacements: { reval_id }, type: db.Sequelize.QueryTypes.SELECT }
      );

      if (record.length === 0) continue;
      if (record[0].is_locked === 1 || record[0].is_locked === true) continue;
      if (record[0].faculty_id !== faculty.faculty_id) continue;
      
      if (record[0].revised_marks === null || record[0].revised_marks === undefined) {
         // Cannot lock if no marks provided
         continue;
      }

      await db.sequelize.query(
        'UPDATE revaluation_entry SET is_locked = 1, locked_at = NOW() WHERE reval_id = :reval_id',
        {
          replacements: { reval_id },
          type: db.Sequelize.QueryTypes.UPDATE
        }
      );
    }

    return res.status(200).json({ success: true, message: 'Records locked successfully.' });
  } catch (error) {
    console.error('Error locking revaluations:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAssignedRevaluations,
  saveRevaluationDraft,
  lockRevaluation
};
