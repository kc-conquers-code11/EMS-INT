const express = require('express');
const { validate } = require('../../middlewares/validate.js');
const {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParamSchema,
} = require('../../validations/masterValidations/department.validations.js');
const {
  submitDepartmentSetupSchema,
  updateDepartmentSetupSchema,
} = require('../../validations/masterValidations/departmentSetup.validations.js');
const {
  idParamSchema,
} = require('../../validations/masterValidations/institution.validations.js');

const {
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
} = require('../../controllers/masterController/department.controller.js');

const {
  createDepartmentSetup,
  getDepartmentSetup,
  updateDepartmentSetup,
  restoreDepartment,
} = require('../../controllers/masterController/departmentSetup.controller.js');

const router = express.Router();

// Auth: app-level verifyToken (same as institution / coe routes)

router.get('/depart-list', getDepartList);
router.get('/dropdown', getDepartmentsDropdown);
router.get('/institution/:id/check', validate(idParamSchema, 'params'), checkInstitutionDepartments);
router.get('/institution/:id', validate(idParamSchema, 'params'), getDepartmentsByInstitution);
router.get('/', getAllDepartments);

router.post(
  '/setup',
  validate(submitDepartmentSetupSchema, 'body'),
  createDepartmentSetup
);

router.get(
  '/:depart_id/setup',
  validate(departmentIdParamSchema, 'params'),
  getDepartmentSetup
);

router.put(
  '/:depart_id/setup',
  validate(departmentIdParamSchema, 'params'),
  validate(updateDepartmentSetupSchema, 'body'),
  updateDepartmentSetup
);

router.patch(
  '/:depart_id/restore',
  validate(departmentIdParamSchema, 'params'),
  restoreDepartment
);

router.get('/:depart_id', validate(departmentIdParamSchema, 'params'), getDepartmentById);

router.post('/', validate(createDepartmentSchema, 'body'), createDepartment);

router.put(
  '/:depart_id',
  validate(departmentIdParamSchema, 'params'),
  validate(updateDepartmentSchema, 'body'),
  updateDepartment
);

router.delete(
  '/:depart_id',
  validate(departmentIdParamSchema, 'params'),
  deleteDepartment
);

router.delete(
  '/:depart_id/permanent',
  validate(departmentIdParamSchema, 'params'),
  permanentDeleteDepartment
);

module.exports = router;
