const sequelize = require('../../config/db.js');
const Sequelize = require('sequelize');
const schemeModel = require('../../models/scheme.js');
const programmeModel = require('../../models/programme.js');
const {
  getEffectiveScope,
  getProgrammeIdsInScope,
  assertProgrammeInScope,
  assertSchemeInScope,
} = require('../../helpers/scope.helper.js');

const scheme = schemeModel(sequelize, Sequelize.DataTypes);
const programme = programmeModel(sequelize, Sequelize.DataTypes);
const { Op } = require('sequelize');

const scopeFrom = (req) => getEffectiveScope(req.user);

const handleScopeError = (res, error, fallbackMessage = 'Internal server error') => {
  if (error?.status === 403 || error?.status === 404) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
    error: error.message,
  });
};

const buildProgrammeScopeWhere = async (scope) => {
  const programmeIds = await getProgrammeIdsInScope(scope);
  if (programmeIds === null) return {};
  if (programmeIds.length === 0) return { programm_id: { [Op.in]: [] } };
  return { programm_id: { [Op.in]: programmeIds } };
};

const attachProgrammeDetails = async (schemeRows) => {
  const programmeIds = [...new Set(schemeRows.map((item) => item.programm_id).filter(Boolean))];

  let programmeMap = {};
  if (programmeIds.length > 0) {
    const programmes = await programme.findAll({
      where: { programm_id: programmeIds },
      attributes: [
        'programm_id',
        'programme_name',
        'programme_code',
        'degree_type',
        'duration_years',
        'total_semesters',
        'status',
      ],
    });

    programmeMap = programmes.reduce((map, prog) => {
      map[prog.programm_id] = prog;
      return map;
    }, {});
  }

  return schemeRows.map((schemeItem) => {
    const schemeObj = schemeItem.toJSON ? schemeItem.toJSON() : schemeItem;
    schemeObj.programme_details = programmeMap[schemeObj.programm_id] || null;
    return schemeObj;
  });
};

const createScheme = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const {
      programm_id,
      scheme_name,
      scheme_year,
      description,
      status,
      scheme_code,
      scheme_type,
      regulation,
      applicable_from_year,
      total_semesters,
      credit_system_type,
      total_credits,
      grading_system,
      branches,
    } = req.body;

    await assertProgrammeInScope(scope, programm_id);

    const data = await scheme.create({
      programm_id,
      scheme_name,
      scheme_year,
      description,
      status,
      scheme_code,
      scheme_type,
      regulation,
      applicable_from_year,
      total_semesters,
      credit_system_type,
      total_credits,
      grading_system,
      branches,
    });

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data,
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error creating scheme');
  }
};

const getAllSchemes = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const scopeWhere = await buildProgrammeScopeWhere(scope);

    const { count, rows } = await scheme.findAndCountAll({
      where: scopeWhere,
      limit: limitNum,
      offset,
      order: [['scheme_id', 'DESC']],
    });

    const dataWithProgramme = await attachProgrammeDetails(rows);

    res.status(200).json({
      success: true,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 0,
      data: dataWithProgramme,
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error fetching schemes');
  }
};

const getSchemeById = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const id = req.params.id;

    await assertSchemeInScope(scope, id);

    const data = await scheme.findByPk(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    const [responseData] = await attachProgrammeDetails([data]);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error fetching scheme');
  }
};

const updateScheme = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const id = req.params.id;

    await assertSchemeInScope(scope, id);

    const allowedFields = [
      'programm_id',
      'scheme_name',
      'scheme_year',
      'description',
      'status',
      'scheme_code',
      'scheme_type',
      'regulation',
      'applicable_from_year',
      'total_semesters',
      'credit_system_type',
      'total_credits',
      'grading_system',
      'branches',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    if (updateData.programm_id) {
      await assertProgrammeInScope(scope, updateData.programm_id);
    }

    const [updated] = await scheme.update(updateData, {
      where: { scheme_id: id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    const updatedData = await scheme.findByPk(id);
    const [responseData] = await attachProgrammeDetails([updatedData]);

    res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: responseData,
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error updating scheme');
  }
};

const deleteScheme = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const id = req.params.id;

    await assertSchemeInScope(scope, id);

    const deleted = await scheme.destroy({
      where: { scheme_id: id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme moved to trash successfully',
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error deleting scheme');
  }
};

const getDeletedSchemes = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const scopeWhere = await buildProgrammeScopeWhere(scope);

    const { count, rows } = await scheme.findAndCountAll({
      paranoid: false,
      where: {
        ...scopeWhere,
        deletedAt: { [Op.ne]: null },
      },
      limit: limitNum,
      offset,
      order: [['deletedAt', 'DESC']],
    });

    const dataWithProgramme = await attachProgrammeDetails(rows);

    res.status(200).json({
      success: true,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 0,
      data: dataWithProgramme,
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error fetching deleted schemes');
  }
};

const restoreScheme = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const id = req.params.id;

    await assertSchemeInScope(scope, id, { includeDeleted: true });

    const restored = await scheme.restore({
      where: { scheme_id: id },
    });

    if (!restored) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found or not deleted',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme restored successfully',
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error restoring scheme');
  }
};

const getSchemesDropdown = async (req, res) => {
  try {
    const scope = scopeFrom(req);
    const scopeWhere = await buildProgrammeScopeWhere(scope);

    const data = await scheme.findAll({
      where: {
        ...scopeWhere,
        status: 'active',
      },
      attributes: ['scheme_id', 'scheme_name', 'scheme_year', 'programm_id'],
      order: [['scheme_name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data,
      message: 'Schemes dropdown retrieved successfully',
    });
  } catch (error) {
    return handleScopeError(res, error, 'Error fetching schemes dropdown');
  }
};

module.exports = {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getDeletedSchemes,
  restoreScheme,
  getSchemesDropdown,
};
