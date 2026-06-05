const express = require('express');
const {
  verifyToken,
  authorizePermissions,
} = require('../../middlewares/auth.middleware.js');
const {
  getAllTimeSlots,
  getTimeSlotById,
  getTimeSlotsByEvent,
  createTimeSlot,
  bulkCreateTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
  restoreTimeSlot,
  permanentDeleteTimeSlot,
} = require('../../controllers/timeTable/timeSlot.controller.js');

const router = express.Router();

// All routes require authentication and Admin role
router.use(verifyToken);

// ==================== GET ROUTES ====================
router.get('/', getAllTimeSlots);
router.get('/event/:event_id', getTimeSlotsByEvent);
router.get('/:slot_id', getTimeSlotById);

// ==================== POST ROUTES ====================
router.post('/', createTimeSlot);
router.post('/bulk', bulkCreateTimeSlots);

// ==================== PUT/PATCH ROUTES ====================
router.put('/:slot_id', updateTimeSlot);
router.patch('/:slot_id/restore', restoreTimeSlot);

// ==================== DELETE ROUTES ====================
router.delete('/:slot_id', deleteTimeSlot);
router.delete('/:slot_id/permanent', permanentDeleteTimeSlot);

module.exports = router;
