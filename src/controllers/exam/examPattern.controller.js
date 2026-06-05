const {
  createExamPatternSchema,
  updateExamPatternSchema,
  examPatternIdParamSchema,
  idParamSchema,
} = require('../../validations/exam/examPattern.validations.js');
const { ZodError } = require('zod');
const db = require('../../../models/index.js');

// Get all exam patterns with programme details
const getAllExamPatterns = async (req, res) => {
  try {
    const examPatterns = await db.sequelize.query(
      `
      SELECT 
        ep.*,
        p.programme_name, p.programme_code,
        p.degree_type, p.duration_years
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id AND p.deletedAt IS NULL
      WHERE ep.deletedAt IS NULL
      ORDER BY ep.createdAt DESC
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examPatterns,
      message: 'Exam patterns retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllExamPatterns:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam pattern by ID with programme details
const getExamPatternById = async (req, res) => {
  try {
    const { pattern_id } = examPatternIdParamSchema.parse(req.params);

    const [examPattern] = await db.sequelize.query(
      `
      SELECT 
        ep.*,
        p.programme_name, p.programme_code,
        p.degree_type, p.duration_years
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id AND p.deletedAt IS NULL
      WHERE ep.pattern_id = :pattern_id AND ep.deletedAt IS NULL
    `,
      {
        replacements: { pattern_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!examPattern) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found',
      });
    }

    res.status(200).json({
      success: true,
      data: examPattern,
      message: 'Exam pattern retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamPatternById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam patterns by programme ID
const getExamPatternsByProgramme = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Check if programme exists
    const programme = await db.sequelize.query(
      `SELECT * FROM programme WHERE programm_id = :id AND deletedAt IS NULL`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!programme || programme.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found',
      });
    }

    const examPatterns = await db.sequelize.query(
      `
      SELECT 
        ep.*
      FROM exam_pattern ep
      WHERE ep.programm_id = :id AND ep.deletedAt IS NULL
      ORDER BY ep.createdAt DESC
    `,
      {
        replacements: { id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examPatterns,
      programme_name: programme[0].programme_name,
      message: 'Exam patterns retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamPatternsByProgramme:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create new exam pattern
const createExamPattern = async (req, res) => {
  try {
    const validatedData = createExamPatternSchema.parse(req.body);

    // Check if programme exists
    const programme = await db.sequelize.query(
      `SELECT * FROM programme WHERE programm_id = :programm_id AND deletedAt IS NULL`,
      {
        replacements: { programm_id: validatedData.programm_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!programme || programme.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Programme not found. Please select a valid programme.',
      });
    }

    // Check if exam pattern with same name exists for this programme
    const existingPattern = await db.sequelize.query(
      `SELECT * FROM exam_pattern 
       WHERE pattern_name = :pattern_name 
       AND programm_id = :programm_id 
       AND deletedAt IS NULL`,
      {
        replacements: {
          pattern_name: validatedData.pattern_name,
          programm_id: validatedData.programm_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingPattern && existingPattern.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          'Exam pattern with this name already exists for the selected programme',
      });
    }

    // Create exam pattern using raw SQL
    const pattern_id = require('crypto').randomUUID();
    const now = new Date();

    await db.sequelize.query(
      `INSERT INTO exam_pattern (
        pattern_id, programm_id, pattern_name, grading_type, 
        grace_marks_allowed, grace_marks_max, atkt_rule, 
        rounding_rule, passing_criteria, detention_criteria, 
        status, createdAt, updatedAt
      ) VALUES (
        :pattern_id, :programm_id, :pattern_name, :grading_type,
        :grace_marks_allowed, :grace_marks_max, :atkt_rule,
        :rounding_rule, :passing_criteria, :detention_criteria,
        :status, :now, :now
      )`,
      {
        replacements: {
          pattern_id,
          programm_id: validatedData.programm_id,
          pattern_name: validatedData.pattern_name,
          grading_type: validatedData.grading_type || 'absolute',
          grace_marks_allowed: validatedData.grace_marks_allowed || 0,
          grace_marks_max: validatedData.grace_marks_max || 0,
          atkt_rule: validatedData.atkt_rule || null,
          rounding_rule: validatedData.rounding_rule || null,
          passing_criteria: validatedData.passing_criteria || null,
          detention_criteria: validatedData.detention_criteria || null,
          status:
            validatedData.status !== undefined ? validatedData.status : true,
          now: now,
        },
        type: db.sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch the created exam pattern
    const [createdPattern] = await db.sequelize.query(
      `
      SELECT 
        ep.*,
        p.programme_name, p.programme_code
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id
      WHERE ep.pattern_id = :pattern_id
    `,
      {
        replacements: { pattern_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      data: createdPattern,
      message: 'Exam pattern created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in createExamPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update exam pattern
const updateExamPattern = async (req, res) => {
  try {
    const { pattern_id } = examPatternIdParamSchema.parse(req.params);
    const validatedData = updateExamPatternSchema.parse(req.body);

    // Check if exam pattern exists
    const existingPattern = await db.sequelize.query(
      `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id AND deletedAt IS NULL`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPattern || existingPattern.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found',
      });
    }

    // Check if new programme exists (if programm_id is being updated)
    if (validatedData.programm_id) {
      const programme = await db.sequelize.query(
        `SELECT * FROM programme WHERE programm_id = :programm_id AND deletedAt IS NULL`,
        {
          replacements: { programm_id: validatedData.programm_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!programme || programme.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'New programme not found. Please select a valid programme.',
        });
      }
    }

    // Check for duplicate name (excluding current pattern)
    if (validatedData.pattern_name) {
      const programmId =
        validatedData.programm_id || existingPattern[0].programm_id;

      const duplicatePattern = await db.sequelize.query(
        `SELECT * FROM exam_pattern 
         WHERE pattern_name = :pattern_name 
         AND programm_id = :programm_id 
         AND pattern_id != :pattern_id
         AND deletedAt IS NULL`,
        {
          replacements: {
            pattern_name: validatedData.pattern_name,
            programm_id: programmId,
            pattern_id: pattern_id,
          },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (duplicatePattern && duplicatePattern.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            'Exam pattern with this name already exists for the programme',
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const replacements = { pattern_id };

    if (validatedData.programm_id !== undefined) {
      updateFields.push('programm_id = :programm_id');
      replacements.programm_id = validatedData.programm_id;
    }
    if (validatedData.pattern_name !== undefined) {
      updateFields.push('pattern_name = :pattern_name');
      replacements.pattern_name = validatedData.pattern_name;
    }
    if (validatedData.grading_type !== undefined) {
      updateFields.push('grading_type = :grading_type');
      replacements.grading_type = validatedData.grading_type;
    }
    if (validatedData.grace_marks_allowed !== undefined) {
      updateFields.push('grace_marks_allowed = :grace_marks_allowed');
      replacements.grace_marks_allowed = validatedData.grace_marks_allowed;
    }
    if (validatedData.grace_marks_max !== undefined) {
      updateFields.push('grace_marks_max = :grace_marks_max');
      replacements.grace_marks_max = validatedData.grace_marks_max;
    }
    if (validatedData.atkt_rule !== undefined) {
      updateFields.push('atkt_rule = :atkt_rule');
      replacements.atkt_rule = validatedData.atkt_rule;
    }
    if (validatedData.rounding_rule !== undefined) {
      updateFields.push('rounding_rule = :rounding_rule');
      replacements.rounding_rule = validatedData.rounding_rule;
    }
    if (validatedData.passing_criteria !== undefined) {
      updateFields.push('passing_criteria = :passing_criteria');
      replacements.passing_criteria = validatedData.passing_criteria;
    }
    if (validatedData.detention_criteria !== undefined) {
      updateFields.push('detention_criteria = :detention_criteria');
      replacements.detention_criteria = validatedData.detention_criteria;
    }
    if (validatedData.status !== undefined) {
      updateFields.push('status = :status');
      replacements.status = validatedData.status;
    }

    updateFields.push('updatedAt = :now');
    replacements.now = new Date();

    if (updateFields.length > 1) {
      // More than just updatedAt
      await db.sequelize.query(
        `UPDATE exam_pattern SET ${updateFields.join(', ')} WHERE pattern_id = :pattern_id`,
        {
          replacements,
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    // Fetch updated exam pattern
    const [updatedPattern] = await db.sequelize.query(
      `
      SELECT 
        ep.*,
        p.programme_name, p.programme_code
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id
      WHERE ep.pattern_id = :pattern_id
    `,
      {
        replacements: { pattern_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedPattern,
      message: 'Exam pattern updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in updateExamPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Soft delete exam pattern
const deleteExamPattern = async (req, res) => {
  try {
    const { pattern_id } = examPatternIdParamSchema.parse(req.params);

    // Check if exam pattern exists
    const existingPattern = await db.sequelize.query(
      `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id AND deletedAt IS NULL`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPattern || existingPattern.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found',
      });
    }

    // Soft delete by setting deletedAt
    const now = new Date();
    await db.sequelize.query(
      `UPDATE exam_pattern SET deletedAt = :now WHERE pattern_id = :pattern_id`,
      {
        replacements: { pattern_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam pattern deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in deleteExamPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Permanently delete exam pattern
const permanentDeleteExamPattern = async (req, res) => {
  try {
    const { pattern_id } = examPatternIdParamSchema.parse(req.params);

    // Check if exam pattern exists (including soft deleted)
    const existingPattern = await db.sequelize.query(
      `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPattern || existingPattern.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam pattern not found',
      });
    }

    // Permanent delete
    await db.sequelize.query(
      `DELETE FROM exam_pattern WHERE pattern_id = :pattern_id`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.DELETE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam pattern permanently deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in permanentDeleteExamPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get deleted exam patterns
const getDeletedExamPatterns = async (req, res) => {
  try {
    const examPatterns = await db.sequelize.query(
      `
      SELECT 
        ep.*,
        p.programme_name, p.programme_code
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id
      WHERE ep.deletedAt IS NOT NULL
      ORDER BY ep.deletedAt DESC
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examPatterns,
      message: 'Deleted exam patterns retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedExamPatterns:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Restore soft deleted exam pattern
const restoreExamPattern = async (req, res) => {
  try {
    const { pattern_id } = examPatternIdParamSchema.parse(req.params);

    // Check if exam pattern exists and is deleted
    const existingPattern = await db.sequelize.query(
      `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id AND deletedAt IS NOT NULL`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPattern || existingPattern.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deleted exam pattern not found',
      });
    }

    // Restore by setting deletedAt to NULL
    await db.sequelize.query(
      `UPDATE exam_pattern SET deletedAt = NULL WHERE pattern_id = :pattern_id`,
      {
        replacements: { pattern_id },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam pattern restored successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in restoreExamPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam patterns dropdown (for form selects)
const getExamPatternsDropdown = async (req, res) => {
  try {
    const { programm_id } = req.query;

    let whereCondition = 'ep.deletedAt IS NULL';
    const replacements = {};

    if (programm_id) {
      whereCondition += ' AND ep.programm_id = :programm_id';
      replacements.programm_id = programm_id;
    }

    const examPatterns = await db.sequelize.query(
      `
      SELECT 
        ep.pattern_id,
        ep.pattern_name,
        ep.grading_type,
        ep.programm_id,
        p.programme_name
      FROM exam_pattern ep
      LEFT JOIN programme p ON ep.programm_id = p.programm_id
      WHERE ${whereCondition}
      ORDER BY ep.pattern_name ASC
    `,
      {
        replacements,
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Group by programme
    const patternsByProgramme = {};
    for (const pattern of examPatterns) {
      if (!patternsByProgramme[pattern.programm_id]) {
        patternsByProgramme[pattern.programm_id] = [];
      }
      patternsByProgramme[pattern.programm_id].push(pattern);
    }

    res.status(200).json({
      success: true,
      data: examPatterns,
      groupedByProgramme: patternsByProgramme,
      message: 'Exam patterns dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getExamPatternsDropdown:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllExamPatterns,
  getExamPatternById,
  getExamPatternsByProgramme,
  createExamPattern,
  updateExamPattern,
  deleteExamPattern,
  permanentDeleteExamPattern,
  getDeletedExamPatterns,
  restoreExamPattern,
  getExamPatternsDropdown,
};
