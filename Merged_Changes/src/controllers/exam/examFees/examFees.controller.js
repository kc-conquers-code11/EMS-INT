const examFeeService = require('../../../services/exam/examFees/examFees.service.js');

/**
 * Create a new exam fee mapping
 */
const createExamFee = async (req, res) => {
  try {
    console.log("createExamFee request body:", req.body);
    const data = await examFeeService.createExamFee(req.body);
    return res.status(201).json({
      success: true,
      data,
      message: 'Exam fee mapping created successfully',
    });
  } catch (error) {
    console.error('Error in createExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * List all exam fee mappings (with filtering and pagination)
 */
const getExamFees = async (req, res) => {
  try {
    const data = await examFeeService.getExamFees(req.query);
    const response = {
      success: true,
      data,
      message: 'Exam fee mappings retrieved successfully',
    };
    if (data.total !== undefined) response.total = data.total;
    if (data.page !== undefined) response.page = data.page;
    if (data.totalPages !== undefined) response.totalPages = data.totalPages;

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in getExamFees controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Get single exam fee mapping by ID
 */
const getExamFeeById = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const data = await examFeeService.getExamFeeById(fee_id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Exam fee mapping retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getExamFeeById controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Update an exam fee mapping by ID
 */
const updateExamFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const data = await examFeeService.updateExamFee(fee_id, req.body);
    return res.status(200).json({
      success: true,
      data,
      message: 'Exam fee mapping updated successfully',
    });
  } catch (error) {
    console.error('Error in updateExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Soft delete an exam fee mapping by ID (paranoid mode)
 */
const deleteExamFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const result = await examFeeService.deleteExamFee(fee_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in deleteExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Get all soft-deleted exam fee mappings
 */
const getDeletedExamFees = async (req, res) => {
  try {
    const data = await examFeeService.getDeletedExamFees();
    return res.status(200).json({
      success: true,
      data,
      message: 'Deleted exam fee mappings retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedExamFees controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Restore a soft-deleted exam fee mapping
 */
const restoreExamFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const result = await examFeeService.restoreExamFee(fee_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in restoreExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Permanently delete an exam fee mapping
 */
const permanentDeleteExamFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const result = await examFeeService.permanentDeleteExamFee(fee_id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in permanentDeleteExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

/**
 * Dependency checker for exam fee mapping before permanent deletion
 */
const checkExamFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const data = await examFeeService.checkExamFee(fee_id);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in checkExamFee controller:', error);
    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};

module.exports = {
  createExamFee,
  getExamFees,
  getExamFeeById,
  updateExamFee,
  deleteExamFee,
  getDeletedExamFees,
  restoreExamFee,
  permanentDeleteExamFee,
  checkExamFee,
};
