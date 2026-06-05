const {
  createStudentSchema,
  updateStudentSchema,
  sidParamSchema,
} = require('../../validations/admin/student.validations.js');
const studentService = require('../../services/admin/student.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');
const { ZodError } = require('zod');

const getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents(req.query, getEffectiveScope(req.user));
    return res
      .status(200)
      .json({
        success: true,
        ...result,
        message: 'Students retrieved successfully',
      });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in getAllStudents:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const getDeletedStudents = async (req, res) => {
  try {
    const result = await studentService.getDeletedStudents();
    return res
      .status(200)
      .json({
        success: true,
        data: result,
        message: 'Deleted students retrieved successfully',
      });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in getDeletedStudents:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    const result = await studentService.getStudentById(sid, getEffectiveScope(req.user));
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: result,
        message: 'Student retrieved successfully',
      });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in getStudentById:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const createStudent = async (req, res) => {
  try {
    const validated = createStudentSchema.parse(req.body);
    const result = await studentService.createStudent(validated);
    return res
      .status(201)
      .json({
        success: true,
        data: result,
        message: 'Student created successfully',
      });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in createStudent:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    const validated = updateStudentSchema.parse(req.body);
    const result = await studentService.updateStudent(sid, validated);
    return res
      .status(200)
      .json({
        success: true,
        data: result,
        message: 'Student updated successfully',
      });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in updateStudent:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    await studentService.deleteStudent(sid);
    return res
      .status(200)
      .json({ success: true, message: 'Student soft-deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in deleteStudent:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const restoreStudent = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    await studentService.restoreStudent(sid);
    return res
      .status(200)
      .json({ success: true, message: 'Student restored successfully' });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in restoreStudent:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const permanentDeleteStudent = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    await studentService.permanentDeleteStudent(sid);
    return res
      .status(200)
      .json({ success: true, message: 'Student permanently deleted' });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in permanentDeleteStudent:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error || error.message,
      });
  }
};

const checkStudent = async (req, res) => {
  try {
    const { sid } = sidParamSchema.parse(req.params);
    const result = await studentService.checkStudent(sid);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error('Error in checkStudent:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents,
  getDeletedStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  permanentDeleteStudent,
  checkStudent,
};
