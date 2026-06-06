const express = require('express');
const {
  validateScheme,
} = require('../../validations/masterValidations/schemes.validations.js');
const router = express.Router();
const {
  createScheme,
  getAllSchemes,
  getSchemeById,
  getDeletedSchemes,
  restoreScheme,
  updateScheme,
  deleteScheme,
  getSchemesDropdown
} = require('../../controllers/masterController/schemes.controller.js');

const { validate } = require('../../middlewares/validate.js');
const {
  createSchemeValidation,
  updateSchemeValidation,
  idParamValidation,
  paginationValidation,
} = require('../../validations/masterValidations/schemes.validations.js');

router.post('/', validate(createSchemeValidation), createScheme);

router.get('/dropdown', getSchemesDropdown);

router.get('/', validate(paginationValidation, 'query'), getAllSchemes);

router.get(
  '/deleted',
  validate(paginationValidation, 'query'),
  getDeletedSchemes
);

router.get('/:id', validate(idParamValidation, 'params'), getSchemeById);

router.put(
  '/:id',
  validate(idParamValidation, 'params'),
  validate(updateSchemeValidation),
  updateScheme
);

router.delete('/:id', validate(idParamValidation, 'params'), deleteScheme);

router.post(
  '/:id/restore',
  validate(idParamValidation, 'params'),
  restoreScheme
);

module.exports = router;
