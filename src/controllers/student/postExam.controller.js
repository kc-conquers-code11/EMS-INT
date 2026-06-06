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
      JOIN semester_subject_mapping ssm ON rs.mapping_id = ssm.mapping_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      WHERE er.sid = :student_id AND me.is_locked = 1
    `;

    const results = await db.sequelize.query(simplifiedQuery, {
      replacements: { student_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // Check existing applications
    const revalApps = await db.reval_application.findAll({ where: { student_prn: student.PRN } });
    const reasApps = await db.reassessment_request.findAll({ where: { student_prn: student.PRN } });
    const photoApps = await db.photocopy_request.findAll({ where: { student_prn: student.PRN } });
    
    const appliedRevalSet = new Set(revalApps.map(a => `${a.subject_mapping_id}_${a.component}`));
    const appliedReasSet = new Set(reasApps.map(a => `${a.subject_mapping_id}_${a.component}`));
    const appliedPhotoSet = new Set(photoApps.map(a => `${a.subject_mapping_id}_${a.component}`));

    const eligible = results.map(r => ({
      ...r,
      has_applied_reval: appliedRevalSet.has(`${r.subject_mapping_id}_${r.component}`),
      has_applied_reassessment: appliedReasSet.has(`${r.subject_mapping_id}_${r.component}`),
      has_applied_photocopy: appliedPhotoSet.has(`${r.subject_mapping_id}_${r.component}`)
    }));

    return res.status(200).json({ success: true, data: eligible });
  } catch (error) {
    console.error('Error fetching eligible subjects:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.applyReassessment = async (req, res) => {
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
    const existing = await db.reassessment_request.findOne({
      where: { student_prn: student.PRN, subject_mapping_id, component }
    });

    if (existing) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Already applied for Reassessment for this component.' });
    }

    const application = await db.reassessment_request.create({
      student_prn: student.PRN,
      subject_mapping_id,
      component,
      fee_status: 'PAID', // mocking successful payment
      status: 'APPLIED'
    }, { transaction });

    await transaction.commit();
    return res.status(201).json({ success: true, message: 'Reassessment applied successfully', data: application });
  } catch (error) {
    await transaction.rollback();
    console.error('Error applying for reassessment:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.applyPhotocopy = async (req, res) => {
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
    const existing = await db.photocopy_request.findOne({
      where: { student_prn: student.PRN, subject_mapping_id, component }
    });

    if (existing) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Already applied for Photocopy for this component.' });
    }

    const application = await db.photocopy_request.create({
      student_prn: student.PRN,
      subject_mapping_id,
      component,
      fee_status: 'PAID', // mocking successful payment
      status: 'APPLIED'
    }, { transaction });

    await transaction.commit();
    return res.status(201).json({ success: true, message: 'Photocopy applied successfully', data: application });
  } catch (error) {
    await transaction.rollback();
    console.error('Error applying for photocopy:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
