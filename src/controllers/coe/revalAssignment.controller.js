const db = require('../../../models');

exports.getApplications = async (req, res) => {
  try {
    // Fetch PAID or ASSIGNED applications to show in COE dashboard
    const query = `
      SELECT 
        ra.id as application_id,
        ra.student_prn,
        ra.subject_mapping_id as reg_subj_id,
        ra.component,
        ra.status,
        sub.subject_code,
        sub.subject_name
      FROM reval_application ra
      JOIN registration_subject rs ON ra.subject_mapping_id = rs.reg_subj_id
      JOIN semester_subject_mapping ssm ON rs.mapping_id = ssm.mapping_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      ORDER BY ra.createdAt DESC
    `;
    
    const applications = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    // Also fetch active faculties to populate the dropdown
    const faculties = await db.faculty.findAll({
      attributes: ['faculty_id', 'name', 'email'],
      where: { status: 1 }
    });

    return res.status(200).json({ success: true, data: { applications, faculties } });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.assignFaculty = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { application_id, faculty_id } = req.body;

    if (!application_id || !faculty_id) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Missing application_id or faculty_id' });
    }

    const application = await db.reval_application.findByPk(application_id);
    if (!application) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'APPLIED') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Application is already assigned or evaluated' });
    }

    // Verify faculty exists
    const faculty = await db.faculty.findByPk(faculty_id);
    if (!faculty) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Update application status
    await application.update({ status: 'ASSIGNED' }, { transaction });

    // Insert into revaluation_entry
    // The mask / dummy number (e.g. REV-10245) is generated during the faculty's view fetching (blind-grading).
    // Here we just insert the actual mapping.
    await db.revaluation_entry.create({
      reg_subj_id: application.subject_mapping_id,
      component: application.component,
      faculty_id: faculty.faculty_id,
      revised_marks: null,
      is_locked: false
    }, { transaction });

    await transaction.commit();
    return res.status(200).json({ success: true, message: 'Faculty assigned successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error assigning faculty:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Revaluation entry already exists for this mapping.' });
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
