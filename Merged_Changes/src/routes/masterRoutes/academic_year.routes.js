const express = require('express');
const router = express.Router();
const {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  getDeletedAcademicYears,
  restoreAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  getAcademicYearsDropdown
} = require('../../controllers/masterController/academic_year.controller.js');

const { validate } = require('../../middlewares/validate.js');
const {
  createAcademicYearValidation,
  updateAcademicYearValidation,
  idParamValidation,
  paginationValidation,
} = require('../../validations/masterValidations/academic_year.validations.js');

const {
  verifyToken,
} = require('../../middlewares/auth.middleware.js');

router.use(verifyToken);


router.post('/', validate(createAcademicYearValidation), createAcademicYear);

router.get('/dropdown', getAcademicYearsDropdown);

router.get('/', validate(paginationValidation, 'query'), getAllAcademicYears);

router.get(
  '/deleted',
  validate(paginationValidation, 'query'),
  getDeletedAcademicYears
);

router.get('/:id', validate(idParamValidation, 'params'), getAcademicYearById);

router.put(
  '/:id',
  validate(idParamValidation, 'params'),
  validate(updateAcademicYearValidation),
  updateAcademicYear
);

router.delete(
  '/:id',
  validate(idParamValidation, 'params'),
  deleteAcademicYear
);

router.post(
  '/:id/restore',
  validate(idParamValidation, 'params'),
  restoreAcademicYear
);

module.exports = router;
