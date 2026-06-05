const express = require('express');
const { validate } = require('../../middlewares/validate.js');
const {
  createProgrammeSchema,
  updateProgrammeSchema,
  programmeIdParamSchema,
  idParamSchema,
} = require('../../validations/programme/programme.validations.js');
const {
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
} = require('../../controllers/programme/programme.controller.js');

const router = express.Router();

router.get('/', getAllProgrammes);
router.get('/dropdown', getProgrammesDropdown);
router.get('/department/:id', validate(idParamSchema, 'params'), getProgrammesByDepartment);
router.get('/institution/:id', validate(idParamSchema, 'params'), getProgrammesByInstitution);
router.get('/deleted', getDeletedProgramme);
router.get('/:programm_id', validate(programmeIdParamSchema, 'params'), getProgrammeById);

router.get('/department/:id/check', validate(idParamSchema, 'params'), checkDepartmentProgrammes);
router.post('/', validate(createProgrammeSchema, 'body'), createProgramme);
router.put('/:programm_id', validate(programmeIdParamSchema, 'params'), validate(updateProgrammeSchema, 'body'), updateProgramme);
router.delete('/:programm_id', validate(programmeIdParamSchema, 'params'), deleteProgramme);
router.put('/:programm_id/restore', validate(programmeIdParamSchema, 'params'), restoreProgramme);
router.delete('/:programm_id/permanent', validate(programmeIdParamSchema, 'params'), permanentDeleteProgramme);

module.exports = router;
