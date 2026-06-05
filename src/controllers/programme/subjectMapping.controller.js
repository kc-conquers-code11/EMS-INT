const { ZodError } = require('zod');
const db = require('../../../models');
const {
  createSubjectMappingSchema,
  bulkCreateSubjectMappingSchema,
  updateSubjectMappingSchema,
  mappingIdParamSchema,
  idParamSchema,
  getMappingsBySemesterBranchSchema,
} = require('../../validations/programme/subjectMapping.validations.js');

/**
 * Get all subject mappings with related data
 */
const getAllSubjectMappings = async (req, res) => {
  try {
    const { page = 1, limit = 20, semester_id, branch_id, exam_event_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = [];
    const replacements = {};

    if (semester_id) {
      whereConditions.push('ssm.semester_id = :semester_id');
      replacements.semester_id = semester_id;
    }
    if (branch_id) {
      whereConditions.push('ssm.branch_id = :branch_id');
      replacements.branch_id = branch_id;
    }
    if (exam_event_id) {
      whereConditions.push('ssm.exam_event_id = :exam_event_id');
      replacements.exam_event_id = exam_event_id;
    }

    whereConditions.push('ssm.deletedAt IS NULL');

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await db.sequelize.query(
      `SELECT COUNT(*) as total FROM semester_subject_mapping ssm ${whereClause}`,
      { replacements, type: db.Sequelize.QueryTypes.SELECT }
    );

    const mappings = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        s.semester_number, s.term_type as term,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        ee.event_name, ee.exam_type, ee.status as event_status
      FROM semester_subject_mapping ssm
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON ssm.exam_event_id = ee.event_id
      ${whereClause}
      ORDER BY ssm.createdAt DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: { ...replacements, limit: limitNum, offset },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      total: parseInt(countResult.total),
      page: pageNum,
      totalPages: Math.ceil(parseInt(countResult.total) / limitNum),
      data: mappings,
      message: 'Subject mappings retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllSubjectMappings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get subject mapping by ID
 */
const getSubjectMappingById = async (req, res) => {
  try {
    const { mapping_id } = mappingIdParamSchema.parse(req.params);

    const [mapping] = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        s.semester_number, s.term_type as term, s.programm_id,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits, sub.sem as subject_sem,
        ee.event_name, ee.exam_type, ee.status as event_status
      FROM semester_subject_mapping ssm
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON ssm.exam_event_id = ee.event_id
      WHERE ssm.mapping_id = :mapping_id AND ssm.deletedAt IS NULL
    `,
      {
        replacements: { mapping_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Subject mapping not found',
      });
    }

    res.status(200).json({
      success: true,
      data: mapping,
      message: 'Subject mapping retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getSubjectMappingById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get subject mappings by semester ID
 */
const getMappingsBySemester = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { include_inactive = 'false' } = req.query;

    const mappings = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        ee.event_name, ee.exam_type
      FROM semester_subject_mapping ssm
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON ssm.exam_event_id = ee.event_id
      WHERE ssm.semester_id = :semester_id 
        AND ssm.deletedAt IS NULL
        ${include_inactive === 'true' ? '' : 'AND ssm.is_active = 1'}
      ORDER BY b.branch_name ASC, sub.subject_name ASC
    `,
      {
        replacements: { semester_id: id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: mappings,
      message: 'Mappings retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getMappingsBySemester:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get subject mappings by branch ID
 */
const getMappingsByBranch = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { include_inactive = 'false' } = req.query;

    const mappings = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        s.semester_number, s.term_type as term,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        ee.event_name, ee.exam_type
      FROM semester_subject_mapping ssm
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON ssm.exam_event_id = ee.event_id
      WHERE ssm.branch_id = :branch_id 
        AND ssm.deletedAt IS NULL
        ${include_inactive === 'true' ? '' : 'AND ssm.is_active = 1'}
      ORDER BY s.semester_number ASC, sub.subject_name ASC
    `,
      {
        replacements: { branch_id: id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: mappings,
      message: 'Mappings retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getMappingsByBranch:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get subject mappings by semester and branch
 */
const getMappingsBySemesterAndBranch = async (req, res) => {
  try {
    const { semester_id, branch_id } = getMappingsBySemesterBranchSchema.parse(req.params);
    const { include_inactive = 'false' } = req.query;

    const mappings = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits, sub.max_theory, sub.max_practical, sub.max_oral, sub.max_tw,
        ee.event_name, ee.exam_type, ee.reg_start, ee.reg_end
      FROM semester_subject_mapping ssm
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON ssm.exam_event_id = ee.event_id
      WHERE ssm.semester_id = :semester_id 
        AND ssm.branch_id = :branch_id
        AND ssm.deletedAt IS NULL
        ${include_inactive === 'true' ? '' : 'AND ssm.is_active = 1'}
      ORDER BY sub.subject_name ASC
    `,
      {
        replacements: { semester_id, branch_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: mappings,
      message: 'Mappings retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getMappingsBySemesterAndBranch:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get unmapped subjects for a semester and branch
 */
const getUnmappedSubjects = async (req, res) => {
  try {
    const { semester_id, branch_id } = getMappingsBySemesterBranchSchema.parse(req.params);

    const unmappedSubjects = await db.sequelize.query(
      `
      SELECT 
        sub.subject_id, sub.subject_name, sub.subject_code, sub.subject_type, sub.credits, sub.sem
      FROM subject sub
      WHERE sub.deletedAt IS NULL
        AND sub.status = 1
        AND NOT EXISTS (
          SELECT 1 FROM semester_subject_mapping ssm 
          WHERE ssm.subject_id = sub.subject_id 
            AND ssm.semester_id = :semester_id 
            AND ssm.branch_id = :branch_id
            AND ssm.deletedAt IS NULL
        )
      ORDER BY sub.subject_name ASC
    `,
      {
        replacements: { semester_id, branch_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: unmappedSubjects,
      message: 'Unmapped subjects retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getUnmappedSubjects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Create subject mapping - FIXED VERSION without deletedAt
 */
const createSubjectMapping = async (req, res) => {
  try {
    const validatedData = createSubjectMappingSchema.parse(req.body);
    const created_by = req.user?.uid || null;

    // Check if semester exists - REMOVED deletedAt check
    const [semester] = await db.sequelize.query(
      `SELECT semester_id FROM semester WHERE semester_id = :semester_id`,
      { replacements: { semester_id: validatedData.semester_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found',
      });
    }

    // Check if branch exists - REMOVED deletedAt check
    const [branch] = await db.sequelize.query(
      `SELECT branch_id FROM branch WHERE branch_id = :branch_id`,
      { replacements: { branch_id: validatedData.branch_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    // Check if subject exists - REMOVED deletedAt check
    const [subject] = await db.sequelize.query(
      `SELECT subject_id FROM subject WHERE subject_id = :subject_id`,
      { replacements: { subject_id: validatedData.subject_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if exam event exists (if provided) - REMOVED deletedAt check
    if (validatedData.exam_event_id) {
      const [examEvent] = await db.sequelize.query(
        `SELECT event_id FROM exam_event WHERE event_id = :event_id`,
        { replacements: { event_id: validatedData.exam_event_id }, type: db.Sequelize.QueryTypes.SELECT }
      );
      if (!examEvent) {
        return res.status(404).json({
          success: false,
          message: 'Exam event not found',
        });
      }
    }

    // Check for duplicate mapping
    const [existingMapping] = await db.sequelize.query(
      `SELECT mapping_id FROM semester_subject_mapping 
       WHERE semester_id = :semester_id 
         AND branch_id = :branch_id 
         AND subject_id = :subject_id 
         AND exam_event_id ${validatedData.exam_event_id ? '= :exam_event_id' : 'IS NULL'}
         AND deletedAt IS NULL`,
      {
        replacements: {
          semester_id: validatedData.semester_id,
          branch_id: validatedData.branch_id,
          subject_id: validatedData.subject_id,
          exam_event_id: validatedData.exam_event_id || null,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingMapping) {
      return res.status(400).json({
        success: false,
        message: 'This subject is already mapped to the selected semester and branch',
      });
    }

    // Create mapping
    const mapping_id = require('crypto').randomUUID();
    const now = new Date();

    await db.sequelize.query(
      `INSERT INTO semester_subject_mapping (
        mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, mapped_by, createdAt, updatedAt
      ) VALUES (
        :mapping_id, :semester_id, :branch_id, :subject_id, :exam_event_id, :is_active, :mapped_by, :now, :now
      )`,
      {
        replacements: {
          mapping_id,
          semester_id: validatedData.semester_id,
          branch_id: validatedData.branch_id,
          subject_id: validatedData.subject_id,
          exam_event_id: validatedData.exam_event_id || null,
          is_active: validatedData.is_active ? 1 : 0,
          mapped_by: created_by,
          now,
        },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch created mapping
    const [createdMapping] = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        s.semester_number,
        b.branch_name,
        sub.subject_name, sub.subject_code
      FROM semester_subject_mapping ssm
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      WHERE ssm.mapping_id = :mapping_id
    `,
      {
        replacements: { mapping_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      data: createdMapping,
      message: 'Subject mapping created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in createSubjectMapping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Bulk create subject mappings
 */
const bulkCreateSubjectMappings = async (req, res) => {
  try {
    const { mappings } = bulkCreateSubjectMappingSchema.parse(req.body);
    const created_by = req.user?.uid || null;

    const results = {
      success: [],
      failed: [],
    };

    for (const mapping of mappings) {
      try {
        const validated = createSubjectMappingSchema.parse(mapping);

        const [existingMapping] = await db.sequelize.query(
          `SELECT mapping_id FROM semester_subject_mapping 
           WHERE semester_id = :semester_id 
             AND branch_id = :branch_id 
             AND subject_id = :subject_id 
             AND deletedAt IS NULL`,
          {
            replacements: {
              semester_id: validated.semester_id,
              branch_id: validated.branch_id,
              subject_id: validated.subject_id,
            },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );

        if (existingMapping) {
          results.failed.push({
            ...validated,
            error: 'Subject already mapped to this semester and branch',
          });
          continue;
        }

        const mapping_id = require('crypto').randomUUID();
        const now = new Date();

        await db.sequelize.query(
          `INSERT INTO semester_subject_mapping (
            mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, mapped_by, createdAt, updatedAt
          ) VALUES (
            :mapping_id, :semester_id, :branch_id, :subject_id, :exam_event_id, :is_active, :mapped_by, :now, :now
          )`,
          {
            replacements: {
              mapping_id,
              semester_id: validated.semester_id,
              branch_id: validated.branch_id,
              subject_id: validated.subject_id,
              exam_event_id: validated.exam_event_id || null,
              is_active: validated.is_active ? 1 : 0,
              mapped_by: created_by,
              now,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );

        results.success.push({
          mapping_id,
          ...validated,
        });
      } catch (err) {
        results.failed.push({
          ...mapping,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `${results.success.length} mappings created successfully, ${results.failed.length} failed`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in bulkCreateSubjectMappings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Update subject mapping
 */
const updateSubjectMapping = async (req, res) => {
  try {
    const { mapping_id } = mappingIdParamSchema.parse(req.params);
    const validatedData = updateSubjectMappingSchema.parse(req.body);

    const [existingMapping] = await db.sequelize.query(
      `SELECT * FROM semester_subject_mapping WHERE mapping_id = :mapping_id AND deletedAt IS NULL`,
      {
        replacements: { mapping_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingMapping) {
      return res.status(404).json({
        success: false,
        message: 'Subject mapping not found',
      });
    }

    const updateFields = [];
    const replacements = { mapping_id };

    if (validatedData.semester_id !== undefined) {
      const [semester] = await db.sequelize.query(
        `SELECT semester_id FROM semester WHERE semester_id = :semester_id`,
        { replacements: { semester_id: validatedData.semester_id }, type: db.Sequelize.QueryTypes.SELECT }
      );
      if (!semester) {
        return res.status(404).json({ success: false, message: 'New semester not found' });
      }
      updateFields.push('semester_id = :semester_id');
      replacements.semester_id = validatedData.semester_id;
    }

    if (validatedData.branch_id !== undefined) {
      const [branch] = await db.sequelize.query(
        `SELECT branch_id FROM branch WHERE branch_id = :branch_id`,
        { replacements: { branch_id: validatedData.branch_id }, type: db.Sequelize.QueryTypes.SELECT }
      );
      if (!branch) {
        return res.status(404).json({ success: false, message: 'New branch not found' });
      }
      updateFields.push('branch_id = :branch_id');
      replacements.branch_id = validatedData.branch_id;
    }

    if (validatedData.subject_id !== undefined) {
      const [subject] = await db.sequelize.query(
        `SELECT subject_id FROM subject WHERE subject_id = :subject_id`,
        { replacements: { subject_id: validatedData.subject_id }, type: db.Sequelize.QueryTypes.SELECT }
      );
      if (!subject) {
        return res.status(404).json({ success: false, message: 'New subject not found' });
      }
      updateFields.push('subject_id = :subject_id');
      replacements.subject_id = validatedData.subject_id;
    }

    if (validatedData.exam_event_id !== undefined) {
      if (validatedData.exam_event_id) {
        const [examEvent] = await db.sequelize.query(
          `SELECT event_id FROM exam_event WHERE event_id = :event_id`,
          { replacements: { event_id: validatedData.exam_event_id }, type: db.Sequelize.QueryTypes.SELECT }
        );
        if (!examEvent) {
          return res.status(404).json({ success: false, message: 'Exam event not found' });
        }
      }
      updateFields.push('exam_event_id = :exam_event_id');
      replacements.exam_event_id = validatedData.exam_event_id;
    }

    if (validatedData.is_active !== undefined) {
      updateFields.push('is_active = :is_active');
      replacements.is_active = validatedData.is_active ? 1 : 0;
    }

    updateFields.push('updatedAt = :now');
    replacements.now = new Date();

    if (updateFields.length > 0) {
      await db.sequelize.query(
        `UPDATE semester_subject_mapping SET ${updateFields.join(', ')} WHERE mapping_id = :mapping_id`,
        { replacements, type: db.Sequelize.QueryTypes.UPDATE }
      );
    }

    const [updatedMapping] = await db.sequelize.query(
      `
      SELECT 
        ssm.*,
        s.semester_number,
        b.branch_name,
        sub.subject_name, sub.subject_code
      FROM semester_subject_mapping ssm
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      WHERE ssm.mapping_id = :mapping_id
    `,
      {
        replacements: { mapping_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedMapping,
      message: 'Subject mapping updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in updateSubjectMapping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Soft delete subject mapping
 */
const deleteSubjectMapping = async (req, res) => {
  try {
    const { mapping_id } = mappingIdParamSchema.parse(req.params);

    const [existingMapping] = await db.sequelize.query(
      `SELECT mapping_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id AND deletedAt IS NULL`,
      {
        replacements: { mapping_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingMapping) {
      return res.status(404).json({
        success: false,
        message: 'Subject mapping not found',
      });
    }

    const [timetableEntry] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE mapping_id = :mapping_id AND deletedAt IS NULL LIMIT 1`,
      { replacements: { mapping_id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    if (timetableEntry) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete mapping as it is already used in timetable schedule',
      });
    }

    const now = new Date();
    await db.sequelize.query(
      `UPDATE semester_subject_mapping SET deletedAt = :now WHERE mapping_id = :mapping_id`,
      { replacements: { mapping_id, now }, type: db.Sequelize.QueryTypes.UPDATE }
    );

    res.status(200).json({
      success: true,
      message: 'Subject mapping deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in deleteSubjectMapping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Restore soft deleted subject mapping
 */
const restoreSubjectMapping = async (req, res) => {
  try {
    const { mapping_id } = mappingIdParamSchema.parse(req.params);

    const [mapping] = await db.sequelize.query(
      `SELECT mapping_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id AND deletedAt IS NOT NULL`,
      {
        replacements: { mapping_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Deleted subject mapping not found',
      });
    }

    await db.sequelize.query(
      `UPDATE semester_subject_mapping SET deletedAt = NULL WHERE mapping_id = :mapping_id`,
      { replacements: { mapping_id }, type: db.Sequelize.QueryTypes.UPDATE }
    );

    res.status(200).json({
      success: true,
      message: 'Subject mapping restored successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in restoreSubjectMapping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Permanently delete subject mapping
 */
const permanentDeleteSubjectMapping = async (req, res) => {
  try {
    const { mapping_id } = mappingIdParamSchema.parse(req.params);

    const [mapping] = await db.sequelize.query(
      `SELECT mapping_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id`,
      {
        replacements: { mapping_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Subject mapping not found',
      });
    }

    await db.sequelize.query(
      `DELETE FROM semester_subject_mapping WHERE mapping_id = :mapping_id`,
      { replacements: { mapping_id }, type: db.Sequelize.QueryTypes.DELETE }
    );

    res.status(200).json({
      success: true,
      message: 'Subject mapping permanently deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in permanentDeleteSubjectMapping:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubjectMappings,
  getSubjectMappingById,
  getMappingsBySemester,
  getMappingsByBranch,
  getMappingsBySemesterAndBranch,
  getUnmappedSubjects,
  createSubjectMapping,
  bulkCreateSubjectMappings,
  updateSubjectMapping,
  deleteSubjectMapping,
  restoreSubjectMapping,
  permanentDeleteSubjectMapping,
};