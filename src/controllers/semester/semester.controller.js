const semesterService = require('../../services/semester/semester.service');

const getAllSemesters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await semesterService.getAllSemesters(page, limit);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Semesters retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllSemesters:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getSemesterById = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const data = await semesterService.getSemesterById(semester_id);

    res.status(200).json({
      success: true,
      data,
      message: 'Semester retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSemesterById:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getSemestersByProgramme = async (req, res) => {
  try {
    const { programme_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await semesterService.getSemestersByProgramme(programme_id, page, limit);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Semesters retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSemestersByProgramme:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getSemestersByAcademicYear = async (req, res) => {
  try {
    const { academic_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await semesterService.getSemestersByAcademicYear(academic_id, page, limit);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Semesters retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSemestersByAcademicYear:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const createSemester = async (req, res) => {
  try {
    const validatedData = req.body; // Validation handled by route middleware
    const data = await semesterService.createSemester(validatedData);

    res.status(201).json({
      success: true,
      data,
      message: 'Semester created successfully',
    });
  } catch (error) {
    console.error('Error in createSemester:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const updateSemester = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const validatedData = req.body;
    const data = await semesterService.updateSemester(semester_id, validatedData);

    res.status(200).json({
      success: true,
      data,
      message: 'Semester updated successfully',
    });
  } catch (error) {
    console.error('Error in updateSemester:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const updateSemesterStatus = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const { is_active } = req.body;
    const data = await semesterService.updateSemesterStatus(semester_id, is_active);

    res.status(200).json({
      success: true,
      data,
      message: `Semester ${is_active ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error in updateSemesterStatus:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const deleteSemester = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const result = await semesterService.deleteSemester(semester_id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in deleteSemester:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getDeletedSemesters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await semesterService.getDeletedSemesters(page, limit);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Deleted semesters retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedSemesters:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const restoreSemester = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const result = await semesterService.restoreSemester(semester_id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in restoreSemester:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const permanentDeleteSemester = async (req, res) => {
  try {
    const { semester_id } = req.params;
    const result = await semesterService.permanentDeleteSemester(semester_id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in permanentDeleteSemester:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getSemesterDropdown = async (req, res) => {
  try {
    const { programme_id } = req.query;
    const result = await semesterService.getSemesterDropdown(programme_id);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Semesters dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getSemesterDropdown:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  getAllSemesters,
  getSemesterById,
  getSemestersByProgramme,
  getSemestersByAcademicYear,
  createSemester,
  updateSemester,
  updateSemesterStatus,
  deleteSemester,
  getDeletedSemesters,
  restoreSemester,
  permanentDeleteSemester,
  getSemesterDropdown,
};
