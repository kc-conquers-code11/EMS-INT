const branchService = require('../../services/programme/branch.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');

// Get all branches with programme and department details
const getAllBranches = async (req, res) => {
  try {
    const data = await branchService.getAllBranches(getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data,
      message: 'Branches retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllBranches:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get branch by ID with programme and department details
const getBranchById = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const data = await branchService.getBranchById(branch_id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Branch retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getBranchById:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get branches by programme ID
const getBranchesByProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await branchService.getBranchesByProgramme(id);
    return res.status(200).json({
      success: true,
      data: data.branches,
      programme_name: data.programme_name,
      message: 'Branches retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getBranchesByProgramme:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get branches by department ID
const getBranchesByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await branchService.getBranchesByDepartment(id);
    return res.status(200).json({
      success: true,
      data: data.branches,
      depart_name: data.depart_name,
      message: 'Branches retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getBranchesByDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Create new branch
const createBranch = async (req, res) => {
  try {
    const data = await branchService.createBranch(req.body);
    return res.status(201).json({
      success: true,
      data,
      message: 'Branch created successfully',
    });
  } catch (error) {
    console.error('Error in createBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update branch
const updateBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const data = await branchService.updateBranch(branch_id, req.body);
    return res.status(200).json({
      success: true,
      data,
      message: 'Branch updated successfully',
    });
  } catch (error) {
    console.error('Error in updateBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Soft delete branch
const deleteBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const result = await branchService.deleteBranch(branch_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in deleteBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Permanently delete branch
const permanentDeleteBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const result = await branchService.permanentDeleteBranch(branch_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in permanentDeleteBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Check if programme has branches (for deletion warning)
const checkProgrammeBranches = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchService.checkProgrammeBranches(id);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in checkProgrammeBranches:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get branches dropdown (for form selects)
const getBranchesDropdown = async (req, res) => {
  try {
    const data = await branchService.getBranchesDropdown();
    return res.status(200).json({
      success: true,
      data: data.branches,
      groupedByProgramme: data.groupedByProgramme,
      message: 'Branches dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getBranchesDropdown:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get deleted branches
const getDeletedBranch = async (req, res) => {
  try {
    const data = await branchService.getDeletedBranch();
    return res.status(200).json({
      success: true,
      data,
      message: 'Deleted branches retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Restore soft deleted branch
const restoreBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const result = await branchService.restoreBranch(branch_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in restoreBranch:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  getBranchesByProgramme,
  getBranchesByDepartment,
  createBranch,
  updateBranch,
  deleteBranch,
  permanentDeleteBranch,
  checkProgrammeBranches,
  getBranchesDropdown,
  getDeletedBranch,
  restoreBranch,
};
