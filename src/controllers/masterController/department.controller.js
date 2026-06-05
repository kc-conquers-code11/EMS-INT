const departmentService = require('../../services/masterService/department.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');

// Get all departments with institution details
const getAllDepartments = async (req, res) => {
  try {
    const data = await departmentService.getAllDepartments(getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data,
      message: 'Departments retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllDepartments:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get department by ID with institution details
const getDepartmentById = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const data = await departmentService.getDepartmentById(depart_id, getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data,
      message: 'Department retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get departments by institution ID
const getDepartmentsByInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await departmentService.getDepartmentsByInstitution(id, getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data: data.departments,
      institution_name: data.institution_name,
      message: 'Departments retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDepartmentsByInstitution:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const data = await departmentService.createDepartment(req.body, getEffectiveScope(req.user));
    return res.status(201).json({
      success: true,
      data,
      message: 'Department created successfully',
    });
  } catch (error) {
    console.error('Error in createDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const data = await departmentService.updateDepartment(depart_id, req.body, getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data,
      message: 'Department updated successfully',
    });
  } catch (error) {
    console.error('Error in updateDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Soft delete department (set status to false)
const deleteDepartment = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const result = await departmentService.deleteDepartment(
      depart_id,
      req.user?.uid,
      getEffectiveScope(req.user)
    );
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in deleteDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Permanently delete department (hard delete)
const permanentDeleteDepartment = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const result = await departmentService.permanentDeleteDepartment(depart_id, getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in permanentDeleteDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Check if institution has departments (for deletion warning)
const checkInstitutionDepartments = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await departmentService.checkInstitutionDepartments(id, getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in checkInstitutionDepartments:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get departments dropdown for institution (for form selects)
const getDepartmentsDropdown = async (req, res) => {
  try {
    const data = await departmentService.getDepartmentsDropdown(getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data: data.departments,
      groupedByInstitution: data.groupedByInstitution,
      message: 'Departments dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDepartmentsDropdown:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get department list with HOD details using raw SQL
const getDepartList = async (req, res) => {
  try {
    const data = await departmentService.getDepartList(getEffectiveScope(req.user));
    return res.status(200).json({
      success: true,
      data,
      message: 'Department list retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDepartList:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByInstitution,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  permanentDeleteDepartment,
  checkInstitutionDepartments,
  getDepartmentsDropdown,
  getDepartList,
};
