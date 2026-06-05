const express = require('express');
const { validate } = require('../../../middlewares/validate.js');
const {
  createExamFeeSchema,
  updateExamFeeSchema,
  feeIdParamSchema,
  listExamFeesQuerySchema,
} = require('../../../validations/exam/examFees/exam_fees.validation.js');
const {
  createExamFee,
  getExamFees,
  getExamFeeById,
  updateExamFee,
  deleteExamFee,
  getDeletedExamFees,
  restoreExamFee,
  permanentDeleteExamFee,
  checkExamFee,
} = require('../../../controllers/exam/examFees/examFees.controller.js');

const router = express.Router();

// Route mapping with validation middleware
router.post('/', validate(createExamFeeSchema, 'body'), createExamFee);
router.get('/', validate(listExamFeesQuerySchema, 'query'), getExamFees);
router.get('/deleted', getDeletedExamFees);
router.get(
  '/:fee_id/check',
  validate(feeIdParamSchema, 'params'),
  checkExamFee
);
router.get('/:fee_id', validate(feeIdParamSchema, 'params'), getExamFeeById);
router.put(
  '/:fee_id',
  validate(feeIdParamSchema, 'params'),
  validate(updateExamFeeSchema, 'body'),
  updateExamFee
);
router.put(
  '/:fee_id/restore',
  validate(feeIdParamSchema, 'params'),
  restoreExamFee
);
router.delete(
  '/:fee_id/permanent',
  validate(feeIdParamSchema, 'params'),
  permanentDeleteExamFee
);
router.delete('/:fee_id', validate(feeIdParamSchema, 'params'), deleteExamFee);

module.exports = router;
