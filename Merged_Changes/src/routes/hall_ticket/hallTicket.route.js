const express = require('express');
const router = express.Router();
const { validate } = require('../../middlewares/validate');
const {
  hallTicketSettingsSchema,
  hallTicketParamSchema,
  hallTicketSettingsCreateSchema,
  hallTicketSettingsUpdateSchema,
  examEventIdParamSchema,
  hallTicketGenerationControlQuerySchema,
  hallTicketGenerateSchema,
  hallTicketBulkDownloadSchema,
  hallTicketDownloadQuerySchema,
  hallTicketHoldSchema,
  hallTicketPublishSchema,
  examEventIdQuerySchema,
} = require('../../validations/hall_ticket/hallTicket.validations');
const hallTicketController = require('../../controllers/hall_ticket/hallTicket.controller');
const {
  authorizeHallTicketDownload,
  authorizeHallTicketView,
} = require('../../middlewares/hallTicket.middleware');
const { requireStudent, denyStudents } = require('../../middlewares/role.middleware');

// ---------------------------------------------------------------------------
// Student portal (Student role only)
// ---------------------------------------------------------------------------
router.get(
  '/student/view',
  requireStudent,
  authorizeHallTicketView,
  hallTicketController.getStudentHallTicketView
);
router.get(
  '/student/download',
  requireStudent,
  authorizeHallTicketDownload,
  hallTicketController.downloadStudentHallTicket
);

// PDF download (COE + student self-service)
router.get(
  '/download/:studentId/:eventId',
  validate(hallTicketParamSchema, 'params'),
  validate(hallTicketDownloadQuerySchema, 'query'),
  authorizeHallTicketDownload,
  hallTicketController.downloadHallTicket
);
router.get(
  '/download/:studentId',
  validate(hallTicketParamSchema, 'params'),
  validate(hallTicketDownloadQuerySchema, 'query'),
  authorizeHallTicketDownload,
  hallTicketController.downloadHallTicket
);

router.get(
  '/publish-status/:exam_event_id',
  validate(examEventIdParamSchema, 'params'),
  hallTicketController.getHallTicketPublishStatusHandler
);

// ---------------------------------------------------------------------------
// COE / admin hall ticket APIs (students blocked)
// ---------------------------------------------------------------------------


router.get('/settings', hallTicketController.getHallTicketSettings);
router.put('/settings', validate(hallTicketSettingsSchema), hallTicketController.updateHallTicketSettingsLegacy);

router.post(
  '/hall-ticket-settings',
  validate(hallTicketSettingsCreateSchema),
  hallTicketController.createHallTicketSettings
);
router.put(
  '/hall-ticket-settings',
  validate(hallTicketSettingsCreateSchema),
  hallTicketController.saveHallTicketSettings
);
router.get(
  '/hall-ticket-settings/:exam_event_id/preview',
  validate(examEventIdParamSchema, 'params'),
  hallTicketController.previewStudentView
);
router.get(
  '/hall-ticket-settings/:exam_event_id',
  validate(examEventIdParamSchema, 'params'),
  hallTicketController.getHallTicketSettingsByEvent
);
router.put(
  '/hall-ticket-settings/:exam_event_id',
  validate(examEventIdParamSchema, 'params'),
  validate(hallTicketSettingsUpdateSchema),
  hallTicketController.updateHallTicketSettingsByEvent
);
router.delete(
  '/hall-ticket-settings/:exam_event_id',
  validate(examEventIdParamSchema, 'params'),
  hallTicketController.deleteHallTicketSettingsByEvent
);

router.get(
  '/generation-control',
  validate(hallTicketGenerationControlQuerySchema, 'query'),
  hallTicketController.getHallTicketGenerationControlData
);
router.get(
  '/students-eligibility',
  validate(hallTicketGenerationControlQuerySchema, 'query'),
  hallTicketController.getStudentsEligibility
);
router.get(
  '/filter-options',
  validate(examEventIdQuerySchema, 'query'),
  hallTicketController.getEligibilityFilterOptions
);

router.put(
  '/hold',
  validate(hallTicketHoldSchema),
  hallTicketController.setStudentHallTicketHold
);

router.post(
  '/publish',
  validate(hallTicketPublishSchema),
  hallTicketController.publishHallTickets
);

router.post(
  '/generate',
  validate(hallTicketGenerateSchema),
  hallTicketController.generateHallTicket
);

router.post(
  '/download-bulk',
  validate(hallTicketBulkDownloadSchema),
  hallTicketController.downloadHallTicketBulk
);

module.exports = router;
