// src/controllers/institution/institution.controller.js
const {
  createInstitutionSchema,
  updateInstitutionSchema,
  idParamSchema,
} = require('../../validations/masterValidations/institution.validations.js');
const { ZodError } = require('zod');
const {
  getEffectiveScope,
  assertInstitutionAccess,
  enforceInstitutionId,
} = require('../../helpers/scope.helper.js');

// Also update the getAllInstitutions to include department count
// Get all institutions
const getAllInstitutions = async (req, res) => {
  try {
    const scope = getEffectiveScope(req.user);
    const where = scope?.unrestricted
      ? {}
      : scope?.institution_id
        ? { institution_id: scope.institution_id }
        : null;

    if (where === null) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: no institution assigned',
      });
    }

    const institutions = await req.db.models.institution.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    // Add department count and COE email for each institution
    const institutionsWithCounts = await Promise.all(
      institutions.map(async (inst) => {
        const departmentCount = await req.db.models.department.count({
          where: { institution_id: inst.institution_id },
        });
        const coe = await req.db.sequelize.query(
          'SELECT email FROM coe WHERE institution_id = :institution_id AND status = 1 LIMIT 1',
          {
            replacements: { institution_id: inst.institution_id },
            type: req.db.sequelize.QueryTypes.SELECT,
          }
        );
        return {
          ...inst.toJSON(),
          department_count: departmentCount,
          coe_email: coe && coe.length > 0 ? coe[0].email : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: institutionsWithCounts,
      message: 'Institutions retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllInstitutions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get institution by ID
const getInstitutionById = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    assertInstitutionAccess(getEffectiveScope(req.user), id);

    const institution = await req.db.models.institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    res.status(200).json({
      success: true,
      data: institution,
      message: 'Institution retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in getInstitutionById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create new institution
const createInstitution = async (req, res) => {
  try {
    const validatedData = createInstitutionSchema.parse(req.body);

    const institution = await req.db.models.institution.create(validatedData);

    res.status(201).json({
      success: true,
      data: institution,
      message: 'Institution created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in createInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update institution
const updateInstitution = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    assertInstitutionAccess(getEffectiveScope(req.user), id);
    const validatedData = updateInstitutionSchema.parse(req.body);

    const institution = await req.db.models.institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    await institution.update(validatedData);

    res.status(200).json({
      success: true,
      data: institution,
      message: 'Institution updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in updateInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete institution (soft delete by setting status to false)
const deleteInstitution = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    assertInstitutionAccess(getEffectiveScope(req.user), id);

    const institution = await req.db.models.institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    // Check if institution has departments
    const departments = await req.db.models.department.findAll({
      where: { institution_id: id },
    });

    if (departments.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete institution because it has ${departments.length} department(s). Please delete or reassign departments first.`,
        hasDepartments: true,
        departmentCount: departments.length,
        departments: departments,
      });
    }

    // Soft delete - set status to false
    await institution.update({ status: false });

    res.status(200).json({
      success: true,
      message: 'Institution deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in deleteInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Permanently delete institution (hard delete) - with department check
const permanentDeleteInstitution = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    assertInstitutionAccess(getEffectiveScope(req.user), id);

    const institution = await req.db.models.institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    // Check if institution has departments
    const departments = await req.db.models.department.findAll({
      where: { institution_id: id },
    });

    if (departments.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot permanently delete institution because it has ${departments.length} department(s). Please delete or reassign departments first.`,
        hasDepartments: true,
        departmentCount: departments.length,
        departments: departments,
      });
    }

    await institution.destroy();

    res.status(200).json({
      success: true,
      message: 'Institution permanently deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in permanentDeleteInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  permanentDeleteInstitution,
};
