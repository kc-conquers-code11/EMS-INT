const express = require('express');
const { validate } = require('../../middlewares/validate.js');

const {
  createSemesterValidation,
  updateSemesterValidation,
  semesterIdParamValidation,
  paginationValidation,
  programmeIdQueryValidation,
  academicIdQueryValidation,
  updateSemesterStatusValidation,
} = require('../../validations/semester/semester.validations.js');

const {
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
} = require('../../controllers/semester/semester.controller.js');

const router = express.Router();

// GET all semesters (with pagination)
router.get('/', validate(paginationValidation, 'query'), getAllSemesters);

// GET semester dropdown (for forms)
router.get('/dropdown', getSemesterDropdown);

// GET deleted semesters
router.get(
  '/deleted',
  validate(paginationValidation, 'query'),
  getDeletedSemesters
);

// GET semesters by programme ID
router.get(
  '/programme/:programme_id',
  validate(programmeIdQueryValidation, 'params'),
  validate(paginationValidation, 'query'),
  getSemestersByProgramme
);

// GET semesters by academic year
router.get(
  '/academic-year/:academic_id',
  validate(academicIdQueryValidation, 'params'),
  validate(paginationValidation, 'query'),
  getSemestersByAcademicYear
);

// GET semester by ID
router.get(
  '/:semester_id',
  validate(semesterIdParamValidation, 'params'),
  getSemesterById
);

// POST create new semester
router.post('/', validate(createSemesterValidation), createSemester);

// PUT update semester
router.put(
  '/:semester_id',
  validate(semesterIdParamValidation, 'params'),
  validate(updateSemesterValidation),
  updateSemester
);

// PATCH update semester status
router.patch(
  '/:semester_id/status',
  validate(semesterIdParamValidation, 'params'),
  validate(updateSemesterStatusValidation),
  updateSemesterStatus
);

// DELETE soft delete semester
router.delete(
  '/:semester_id',
  validate(semesterIdParamValidation, 'params'),
  deleteSemester
);

// PUT restore soft deleted semester
router.put(
  '/:semester_id/restore',
  validate(semesterIdParamValidation, 'params'),
  restoreSemester
);

// DELETE permanent delete semester
router.delete(
  '/:semester_id/permanent',
  validate(semesterIdParamValidation, 'params'),
  permanentDeleteSemester
);

module.exports = router;
