const express = require('express');
const router = express.Router();

const { validate } = require('../../middlewares/validate.js');

const {
  createSubjectTypeValidation,
  updateSubjectTypeValidation,
  subjectTypeValueParamValidation,
  paginationValidation,
  subjectTypeQueryValidation,
  bulkUpdateValidation,
} = require('../../validations/programme/subjectType.validations.js');

const {
  getAllSubjectTypes,
  getSubjectTypesDropdown,
  getSubjectTypeByValue,
  createSubjectType,
  updateSubjectType,
  deleteSubjectType,
  getSubjectTypeUsageStats,
  getSubjectsByType,
  bulkUpdateSubjectTypes,
} = require('../../controllers/programme/subjectType.controller.js');

// ==================== GET ROUTES ====================

// Get all subject types (with pagination and search)
router.get('/', validate(paginationValidation, 'query'), getAllSubjectTypes);

// Get subject types dropdown (for forms)
router.get(
  '/dropdown',
  validate(subjectTypeQueryValidation, 'query'),
  getSubjectTypesDropdown
);

// Get subject type usage statistics
router.get('/stats/usage', getSubjectTypeUsageStats);

// Get subjects by subject type
router.get(
  '/:value/subjects',
  validate(subjectTypeValueParamValidation, 'params'),
  validate(subjectTypeQueryValidation, 'query'),
  getSubjectsByType
);

// Get subject type by value with details
router.get(
  '/:value',
  validate(subjectTypeValueParamValidation, 'params'),
  getSubjectTypeByValue
);

// ==================== POST ROUTES ====================

// Create/validate new subject type
router.post('/', validate(createSubjectTypeValidation), createSubjectType);

// ==================== PUT/PATCH ROUTES ====================

// Update (rename) subject type
router.put(
  '/:value',
  validate(subjectTypeValueParamValidation, 'params'),
  validate(updateSubjectTypeValidation),
  updateSubjectType
);

// Bulk update subject types for multiple subjects
router.patch(
  '/bulk-update',
  validate(bulkUpdateValidation),
  bulkUpdateSubjectTypes
);

// ==================== DELETE ROUTES ====================

// Delete subject type (set to null or reassign)
router.delete(
  '/:value',
  validate(subjectTypeValueParamValidation, 'params'),
  deleteSubjectType
);

module.exports = router;
