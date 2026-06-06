const programmeService = require('../../services/programme/programme.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');

const scopeFrom = (req) => getEffectiveScope(req.user);

// Get all programmes with department and institution details
const getAllProgrammes = async (req, res) => {
  try {
    const data = await programmeService.getAllProgrammes(scopeFrom(req));
    return res.status(200).json({
      success: true,
      data,
      message: 'Programmes retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllProgrammes:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get programme by ID with department and institution details
const getProgrammeById = async (req, res) => {
  try {
    const { programm_id } = req.params;
    const data = await programmeService.getProgrammeById(programm_id, scopeFrom(req));
    return res.status(200).json({
      success: true,
      data,
      message: 'Programme retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getProgrammeById:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get programmes by department ID
const getProgrammesByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await programmeService.getProgrammesByDepartment(id, scopeFrom(req));
    return res.status(200).json({
      success: true,
      data: data.programmes,
      depart_name: data.depart_name,
      message: 'Programmes retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getProgrammesByDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get programmes by institution ID
const getProgrammesByInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await programmeService.getProgrammesByInstitution(id, scopeFrom(req));
    return res.status(200).json({
      success: true,
      data: data.programmes,
      institution_name: data.institution_name,
      message: 'Programmes retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getProgrammesByInstitution:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Create new programme
const createProgramme = async (req, res) => {
  try {
    const data = await programmeService.createProgramme(req.body, scopeFrom(req));
    return res.status(201).json({
      success: true,
      data,
      message: 'Programme created successfully',
    });
  } catch (error) {
    console.error('Error in createProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update programme
const updateProgramme = async (req, res) => {
  try {
    const { programm_id } = req.params;
    const data = await programmeService.updateProgramme(programm_id, req.body, scopeFrom(req));
    return res.status(200).json({
      success: true,
      data,
      message: 'Programme updated successfully',
    });
  } catch (error) {
    console.error('Error in updateProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Soft delete programme
const deleteProgramme = async (req, res) => {
  try {
    const { programm_id } = req.params;
    const result = await programmeService.deleteProgramme(programm_id, scopeFrom(req));
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in deleteProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Permanently delete programme
const permanentDeleteProgramme = async (req, res) => {
  try {
    const { programm_id } = req.params;
    const result = await programmeService.permanentDeleteProgramme(programm_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in permanentDeleteProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Check if department has programmes (for deletion warning)
const checkDepartmentProgrammes = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await programmeService.checkDepartmentProgrammes(id);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in checkDepartmentProgrammes:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get programmes dropdown (for form selects)
const getProgrammesDropdown = async (req, res) => {
  try {
    const data = await programmeService.getProgrammesDropdown();
    return res.status(200).json({
      success: true,
      data: data.programmes,
      groupedByDepartment: data.groupedByDepartment,
      message: 'Programmes dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getProgrammesDropdown:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get deleted programmes
const getDeletedProgramme = async (req, res) => {
  try {
    const data = await programmeService.getDeletedProgramme();
    return res.status(200).json({
      success: true,
      data,
      message: 'Deleted programmes retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Restore soft deleted programme
const restoreProgramme = async (req, res) => {
  try {
    const { programm_id } = req.params;
    const result = await programmeService.restoreProgramme(programm_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in restoreProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  getAllProgrammes,
  getProgrammeById,
  getProgrammesByDepartment,
  getProgrammesByInstitution,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  permanentDeleteProgramme,
  checkDepartmentProgrammes,
  getProgrammesDropdown,
  getDeletedProgramme,
  restoreProgramme,
};
