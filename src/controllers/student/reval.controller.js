const db = require('../../../models');
const { Op } = require('sequelize');

exports.getEligibleSubjects = async (req, res) => {
  try {
    const student_id = req.user.uid; 
    
    // First find the student PRN from their user ID
    const student = await db.students.findOne({ where: { sid: student_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // We need to fetch marks that are locked/approved for this student
    const query = `
      SELECT 
        rs.reg_subj_id,
        rs.subject_id,
        sub.subject_code,
        sub.subject_name,
        me.component,
        me.marks_obtained,
        me.max_marks,
        ssm.mapping_id as subject_mapping_id
      FROM marks_entry me
      JOIN registration_subject rs ON me.reg_subj_id = rs.reg_subj_id
      JOIN subject sub ON rs.subject_id = sub.subject_id
      JOIN exam_registration er ON rs.exam_reg_id = er.exam_reg_id
      JOIN semester_subject_mapping ssm ON sub.subject_id = ssm.subject_id 
           AND sub.semester_id = ssm.semester_id /* Fallback since sub.sem exists but we might need ssm */
      WHERE er.sid = :student_id 
        AND me.is_locked = 1
    `;
    
    // Note: To be totally safe with joins, we use Sequelize instead of raw query
    // Or we use a slightly more robust raw query:
    const safeQuery = `
      SELECT 
        rs.reg_subj_id,
        sub.subject_name,
        sub.subject_code,
        me.component,
        me.marks_obtained,
        me.max_marks,
        ssm.mapping_id as subject_mapping_id
      FROM exam_registration er
      JOIN registration_subject rs ON er.exam_reg_id = rs.exam_reg_id
      JOIN marks_entry me ON rs.reg_subj_id = me.reg_subj_id
      JOIN subject sub ON rs.subject_id = sub.subject_id
      JOIN semester_subject_mapping ssm ON rs.subject_id = ssm.subject_id AND er.event_id = ssm.exam_event_id
      WHERE er.sid = :student_id AND me.is_locked = 1
    `;
    
    // Actually, getting ssm.mapping_id might be tricky if event_id is null in ssm (which it often is).
    // Let's just use reg_subj_id as the unique identifier and pass it down.
    const simplifiedQuery = `
      SELECT 
        rs.reg_subj_id as subject_mapping_id, 
        sub.subject_name,
        sub.subject_code,
        me.component,
        me.marks_obtained,
        me.max_marks
      FROM exam_registration er
      JOIN registration_subject rs ON er.exam_reg_id = rs.exam_reg_id
      JOIN marks_entry me ON rs.reg_subj_id = me.reg_subj_id
      JOIN subject sub ON rs.subject_id = sub.subject_id
      WHERE er.sid = :student_id AND me.is_locked = 1
    `;

    const results = await db.sequelize.query(simplifiedQuery, {
      replacements: { student_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // Check if they already applied
    const applications = await db.reval_application.findAll({
      where: { student_prn: student.PRN }
    });
    
    const appliedSet = new Set(applications.map(a => `${a.subject_mapping_id}_${a.component}`));

    const eligible = results.map(r => ({
      ...r,
      has_applied: appliedSet.has(`${r.subject_mapping_id}_${r.component}`)
    }));

    return res.status(200).json({ success: true, data: eligible });
  } catch (error) {
    console.error('Error fetching eligible subjects:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.applyRevaluation = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const student_id = req.user.uid;
    const { subject_mapping_id, component } = req.body;

    if (!subject_mapping_id || !component) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Missing subject mapping or component' });
    }

    const student = await db.students.findOne({ where: { sid: student_id } });
    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Check if already applied
    const existing = await db.reval_application.findOne({
      where: { 
        student_prn: student.PRN,
        subject_mapping_id,
        component
      }
    });

    if (existing) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Already applied for this component.' });
    }

    const application = await db.reval_application.create({
      student_prn: student.PRN,
      subject_mapping_id, // we are using reg_subj_id as the mapping internally
      component,
      fee_status: 'PAID', // mocking successful payment
      status: 'APPLIED'
    }, { transaction });

    await transaction.commit();
    return res.status(201).json({ success: true, message: 'Revaluation applied successfully', data: application });
  } catch (error) {
    await transaction.rollback();
    console.error('Error applying for revaluation:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
