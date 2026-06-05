const { ZodError } = require('zod');
const { Op } = require('sequelize');
const sequelize = require('../../config/db.js');
const Sequelize = require('sequelize');
const subjectModel = require('../../models/subject.js');
const Subject = subjectModel(sequelize, Sequelize.DataTypes);

//Get all distinct subject types from database with usage counts
const getAllSubjectTypesFromDB = async () => {
  try {
    // Get distinct subject_type values from existing subjects
    const existingTypes = await Subject.findAll({
      attributes: [
        'subject_type',
        [sequelize.fn('COUNT', sequelize.col('subject_id')), 'subject_count'],
      ],
      where: {
        subject_type: {
          [Op.ne]: null,
          [Op.ne]: '',
        },
      },
      group: ['subject_type'],
      order: [[sequelize.col('subject_type'), 'ASC']],
      raw: true,
      paranoid: false, // Include soft-deleted subjects to get all types
    });

    // Format the response
    const subjectTypes = existingTypes.map((type) => ({
      value: type.subject_type,
      label: type.subject_type,
      subject_count: parseInt(type.subject_count),
      is_used: parseInt(type.subject_count) > 0,
      created_at: null, // Will be updated if we had a separate table
      updated_at: null,
    }));

    return subjectTypes;
  } catch (error) {
    console.error('Error in getAllSubjectTypesFromDB:', error);
    throw error;
  }
};

//Check if a subject type is being used by any subject
const isSubjectTypeInUse = async (subjectTypeValue) => {
  const count = await Subject.count({
    where: {
      subject_type: subjectTypeValue,
    },
    paranoid: false,
  });
  return count > 0;
};

//Get subject type with full details
const getSubjectTypeDetails = async (typeValue) => {
  // Get basic info
  const subjectsWithType = await Subject.findAll({
    where: { subject_type: typeValue },
    attributes: [
      'subject_id',
      'subject_name',
      'subject_code',
      'status',
      'createdAt',
      'deletedAt',
    ],
    paranoid: false,
    limit: 5,
  });

  const totalCount = await Subject.count({
    where: { subject_type: typeValue },
    paranoid: false,
  });

  const activeCount = await Subject.count({
    where: {
      subject_type: typeValue,
      status: true,
    },
  });

  const deletedCount = await Subject.count({
    where: {
      subject_type: typeValue,
      deletedAt: { [Op.ne]: null },
    },
    paranoid: false,
  });

  return {
    value: typeValue,
    label: typeValue,
    total_subjects: totalCount,
    active_subjects: activeCount,
    deleted_subjects: deletedCount,
    sample_subjects: subjectsWithType.map((s) => ({
      subject_id: s.subject_id,
      subject_name: s.subject_name,
      subject_code: s.subject_code,
      status: s.status,
      is_deleted: !!s.deletedAt,
    })),
  };
};

//Get all subject types (with pagination and search)
const getAllSubjectTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let allTypes = await getAllSubjectTypesFromDB();

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      allTypes = allTypes.filter(
        (type) =>
          type.value.toLowerCase().includes(searchLower) ||
          type.label.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const total = allTypes.length;
    const paginatedTypes = allTypes.slice(offset, offset + limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: paginatedTypes,
      message: 'Subject types retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllSubjectTypes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Get all subject types for dropdown (no pagination)
const getSubjectTypesDropdown = async (req, res) => {
  try {
    const { include_used_only = 'false' } = req.query;

    let allTypes = await getAllSubjectTypesFromDB();

    // Filter to only show types that are actually being used
    if (include_used_only === 'true') {
      allTypes = allTypes.filter((type) => type.is_used === true);
    }

    const formattedTypes = allTypes.map((type) => ({
      value: type.value,
      label: type.label,
      subject_count: type.subject_count,
    }));

    res.status(200).json({
      success: true,
      data: formattedTypes,
      message: 'Subject types dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSubjectTypesDropdown:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get subject type by value with details
const getSubjectTypeByValue = async (req, res) => {
  try {
    const { value } = req.params;

    if (!value || value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subject type value is required',
      });
    }

    // Check if type exists
    const exists = await Subject.findOne({
      where: { subject_type: value },
      attributes: ['subject_type'],
      paranoid: false,
    });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: `Subject type '${value}' not found`,
      });
    }

    const typeDetails = await getSubjectTypeDetails(value);

    res.status(200).json({
      success: true,
      data: typeDetails,
      message: 'Subject type retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSubjectTypeByValue:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Create a new subject type (by creating a sample subject or just validating)
const createSubjectType = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subject type value is required',
      });
    }

    const trimmedValue = value.trim();

    // Validate format: letters, numbers, spaces, hyphens, underscores, plus sign
    const validFormat = /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/.test(trimmedValue);
    if (!validFormat) {
      return res.status(400).json({
        success: false,
        message:
          'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign',
      });
    }

    // Check if type already exists
    const existingType = await Subject.findOne({
      where: {
        subject_type: trimmedValue,
      },
      paranoid: false,
    });

    if (existingType) {
      return res.status(400).json({
        success: false,
        message: `Subject type '${trimmedValue}' already exists`,
        existing_type: {
          value: trimmedValue,
          can_be_used: true,
        },
      });
    }

    // Type is valid and can be used when creating subjects
    res.status(201).json({
      success: true,
      data: {
        value: trimmedValue,
        label: trimmedValue,
        message: `Subject type '${trimmedValue}' is available. It will be created when you add the first subject with this type.`,
      },
      message: 'Subject type is available for use',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in createSubjectType:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Update a subject type
const updateSubjectType = async (req, res) => {
  try {
    const { value } = req.params;
    const { new_value } = req.body;

    if (!value || value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Current subject type value is required',
      });
    }

    if (!new_value || new_value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'New subject type value is required',
      });
    }

    const oldValue = value.trim();
    const newValue = new_value.trim();

    if (oldValue === newValue) {
      return res.status(400).json({
        success: false,
        message: 'New value must be different from current value',
      });
    }

    // Validate new value format
    const validFormat = /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/.test(newValue);
    if (!validFormat) {
      return res.status(400).json({
        success: false,
        message:
          'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign',
      });
    }

    // Check if old type exists
    const subjectsWithOldType = await Subject.findAll({
      where: { subject_type: oldValue },
      attributes: ['subject_id'],
      paranoid: false,
    });

    if (subjectsWithOldType.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Subject type '${oldValue}' not found`,
      });
    }

    // Check if new type already exists (case-insensitive)
    const existingWithNew = await Subject.findOne({
      where: {
        subject_type: newValue,
      },
      paranoid: false,
    });

    if (existingWithNew) {
      return res.status(400).json({
        success: false,
        message: `Subject type '${newValue}' already exists. Cannot rename to an existing type.`,
      });
    }

    // Update all subjects with old type to new type
    const [updatedCount] = await Subject.update(
      { subject_type: newValue },
      {
        where: { subject_type: oldValue },
        paranoid: false,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        old_value: oldValue,
        new_value: newValue,
        subjects_updated: updatedCount,
      },
      message: `Successfully renamed subject type from '${oldValue}' to '${newValue}' (${updatedCount} subjects updated)`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in updateSubjectType:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Delete a subject type (set to null for all subjects using it)
//Delete a subject type (set to null for all subjects using it)
const deleteSubjectType = async (req, res) => {
  try {
    const { value } = req.params;
    // Fix: Safely get reassign_to from body (default to null if not provided)
    const reassign_to =
      req.body && req.body.reassign_to ? req.body.reassign_to : null;

    if (!value || value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subject type value is required',
      });
    }

    const typeValue = value.trim();

    // Check if type exists and get count
    const subjectsWithType = await Subject.findAll({
      where: { subject_type: typeValue },
      attributes: ['subject_id', 'subject_name'],
      paranoid: false,
    });

    if (subjectsWithType.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Subject type '${typeValue}' not found`,
      });
    }

    // If reassign_to is provided, check if that type exists
    let reassignCount = 0;
    if (reassign_to && reassign_to.trim()) {
      const reassignValue = reassign_to.trim();
      const reassignExists = await Subject.findOne({
        where: { subject_type: reassignValue },
        paranoid: false,
      });

      if (!reassignExists && reassignValue !== typeValue) {
        return res.status(400).json({
          success: false,
          message: `Target subject type '${reassignValue}' does not exist. Create it first or delete without reassignment.`,
        });
      }

      if (reassignValue !== typeValue) {
        const [updated] = await Subject.update(
          { subject_type: reassignValue },
          {
            where: { subject_type: typeValue },
            paranoid: false,
          }
        );
        reassignCount = updated;
      }
    } else {
      // Set subject_type to NULL for all subjects using this type
      const [updated] = await Subject.update(
        { subject_type: null },
        {
          where: { subject_type: typeValue },
          paranoid: false,
        }
      );
      reassignCount = updated;
    }

    res.status(200).json({
      success: true,
      data: {
        deleted_type: typeValue,
        subjects_affected: subjectsWithType.length,
        subjects_updated: reassignCount,
        action: reassign_to ? `reassigned to '${reassign_to}'` : 'set to NULL',
      },
      message: reassign_to
        ? `Successfully reassigned ${reassignCount} subjects from '${typeValue}' to '${reassign_to}'`
        : `Successfully removed subject type '${typeValue}' from ${reassignCount} subjects`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in deleteSubjectType:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Get subject type usage statistics
const getSubjectTypeUsageStats = async (req, res) => {
  try {
    // Get count of subjects by type
    const stats = await Subject.findAll({
      attributes: [
        'subject_type',
        [sequelize.fn('COUNT', sequelize.col('subject_id')), 'total_count'],
        [
          sequelize.fn(
            'SUM',
            sequelize.literal('CASE WHEN status = 1 THEN 1 ELSE 0 END')
          ),
          'active_count',
        ],
        [
          sequelize.fn(
            'SUM',
            sequelize.literal(
              'CASE WHEN deletedAt IS NOT NULL THEN 1 ELSE 0 END'
            )
          ),
          'deleted_count',
        ],
      ],
      where: {
        subject_type: {
          [Op.ne]: null,
          [Op.ne]: '',
        },
      },
      group: ['subject_type'],
      order: [[sequelize.literal('total_count'), 'DESC']],
      raw: true,
      paranoid: false,
    });

    // Get overall statistics
    const totalSubjects = await Subject.count({ paranoid: false });
    const totalWithType = await Subject.count({
      where: {
        subject_type: {
          [Op.ne]: null,
          [Op.ne]: '',
        },
      },
      paranoid: false,
    });
    const totalWithoutType = totalSubjects - totalWithType;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total_subjects: totalSubjects,
          subjects_with_type: totalWithType,
          subjects_without_type: totalWithoutType,
          unique_subject_types: stats.length,
        },
        breakdown: stats.map((stat) => ({
          subject_type: stat.subject_type,
          total_subjects: parseInt(stat.total_count),
          active_subjects: parseInt(stat.active_count || 0),
          deleted_subjects: parseInt(stat.deleted_count || 0),
        })),
      },
      message: 'Subject type usage statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSubjectTypeUsageStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Get subjects by subject type
const getSubjectsByType = async (req, res) => {
  try {
    const { value } = req.params;
    const { page = 1, limit = 20, include_deleted = 'false' } = req.query;

    if (!value || value.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subject type value is required',
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const whereCondition = { subject_type: value.trim() };

    if (include_deleted !== 'true') {
      whereCondition.deletedAt = null;
    }

    const { count, rows } = await Subject.findAndCountAll({
      where: whereCondition,
      limit: limitNum,
      offset: offset,
      order: [['subject_name', 'ASC']],
      paranoid: include_deleted === 'true' ? false : true,
      attributes: [
        'subject_id',
        'subject_code',
        'subject_name',
        'subject_type',
        'credits',
        'sem',
        'status',
        'createdAt',
        'deletedAt',
      ],
    });

    res.status(200).json({
      success: true,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum),
      subject_type: value.trim(),
      data: rows,
      message: 'Subjects retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSubjectsByType:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//Bulk update subject types for multiple subject
const bulkUpdateSubjectTypes = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required and cannot be empty',
      });
    }

    if (updates.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update more than 100 subjects at once',
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const update of updates) {
      try {
        const { subject_id, subject_type } = update;

        if (!subject_id || !subject_type) {
          results.failed.push({
            subject_id,
            error: 'Subject ID and subject type are required',
          });
          continue;
        }

        // Validate subject_type format
        const validFormat = /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/.test(
          subject_type.trim()
        );
        if (!validFormat) {
          results.failed.push({
            subject_id,
            subject_type,
            error: 'Invalid subject type format',
          });
          continue;
        }

        const trimmedType = subject_type.trim();
        const subject = await Subject.findByPk(subject_id);

        if (!subject) {
          results.failed.push({
            subject_id,
            error: 'Subject not found',
          });
          continue;
        }

        const oldType = subject.subject_type;
        await subject.update({ subject_type: trimmedType });

        results.success.push({
          subject_id,
          subject_name: subject.subject_name,
          old_type: oldType,
          new_type: trimmedType,
        });
      } catch (err) {
        results.failed.push({
          subject_id: update.subject_id,
          error: err.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `Updated ${results.success.length} subjects, ${results.failed.length} failed`,
    });
  } catch (error) {
    console.error('Error in bulkUpdateSubjectTypes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubjectTypes,
  getSubjectTypesDropdown,
  getSubjectTypeByValue,
  createSubjectType,
  updateSubjectType,
  deleteSubjectType,
  getSubjectTypeUsageStats,
  getSubjectsByType,
  bulkUpdateSubjectTypes,
};
