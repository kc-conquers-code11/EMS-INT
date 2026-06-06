const express = require('express');
const { validate } = require('../../middlewares/validate');
const { verifyToken } = require('../../middlewares/auth.middleware');
const {
  createDutySchema,
  updateDutySchema,
  dutyIdSchema,
  rejectDutySchema,
  updateDutyStatusSchema,
  dutyQuerySchema,
} = require('../../validations/allocation/supervisorAllocation.validations');
const {
  createDuty,
  getAllDuties,
  getDutyById,
  updateDuty,
  deleteDuty,
  acceptDuty,
  rejectDuty,
  getFacultyDuties,
  updateDutyStatus,
} = require('../../controllers/allocation/supervisorAllocation.controller');

const router = express.Router();

router.post('/', validate(createDutySchema, 'body'), createDuty);
router.get('/', validate(dutyQuerySchema, 'query'), getAllDuties);
router.get('/faculty-duties', verifyToken, getFacultyDuties);
router.get('/:duty_id', validate(dutyIdSchema, 'params'), getDutyById);
router.put('/:duty_id', validate(dutyIdSchema, 'params'), validate(updateDutySchema, 'body'), updateDuty);
router.delete('/:duty_id', validate(dutyIdSchema, 'params'), deleteDuty);
router.patch('/:duty_id/accept', validate(dutyIdSchema, 'params'), acceptDuty);
router.patch('/:duty_id/reject', validate(rejectDutySchema, 'params'), validate(rejectDutySchema, 'body'), rejectDuty);
router.put('/:duty_id/status', validate(dutyIdSchema, 'params'), validate(updateDutyStatusSchema, 'body'), updateDutyStatus);

module.exports = router;
