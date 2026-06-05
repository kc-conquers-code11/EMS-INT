const express = require('express');
const { validate } = require('../../middlewares/validate.js');

const {
  getAllExamEvents,
  getExamEventById,
  getExamEventsByInstitution,
  getExamEventsByAcademicYear,
  getExamEventsBySemester,
  getExamEventsByStatus,
  getPublishedExamEvents,
  createExamEvent,
  updateExamEvent,
  updateExamEventStatus,
  togglePublishStatus,
  deleteExamEvent,
  getDeletedExamEvents,
  restoreExamEvent,
  permanentDeleteExamEvent,
  getExamEventsDropdown,
  rescheduleExamEvent,
} = require('../../controllers/exam/examEvents.controller.js');

const {
  rescheduleExamEventSchema,
  examEventIdParamSchema,
  idParamSchema,
} = require('../../validations/exam/examEvents.validation.js');

const router = express.Router();


// Public routes (dropdown and published events - accessible after auth)
router.get('/dropdown', getExamEventsDropdown);
router.get('/published', getPublishedExamEvents);

// Main CRUD routes
router.get('/', getAllExamEvents);
router.get('/deleted', getDeletedExamEvents);
router.get('/status/:status', getExamEventsByStatus);
router.get('/institution/:id', getExamEventsByInstitution);
router.get('/academic-year/:id', getExamEventsByAcademicYear);
router.get('/semester/:id', getExamEventsBySemester);
router.get('/:event_id', getExamEventById);

router.post('/', createExamEvent);
router.put('/:event_id', updateExamEvent);
router.put('/:event_id/status', updateExamEventStatus);
router.put('/:event_id/toggle-publish', togglePublishStatus);
router.delete('/:event_id', deleteExamEvent);
router.put('/:event_id/restore', restoreExamEvent);
router.delete('/:event_id/permanent', permanentDeleteExamEvent);

// Wire validation middleware and controller
router.put(
  '/:event_id/reschedule',
  validate(examEventIdParamSchema, 'params'),
  validate(rescheduleExamEventSchema, 'body'),
  rescheduleExamEvent
);

module.exports = router;
