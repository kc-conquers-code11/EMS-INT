const express = require('express');
const {
  requireStudent,
  denyStudents,
} = require('../../middlewares/role.middleware.js');
const {
  getAllTimetableEntries,
  getTimetableEntryById,
  getTimetableByEvent,
  getTimetableByDateRange,
  getTimetableByBranchAndSemester,
  getStudentTimetable,
  createTimetableEntry,
  bulkCreateTimetableEntries,
  updateTimetableEntry,
  rescheduleTimetableEntry,
  publishTimetable,
  deleteTimetableEntry,
  restoreTimetableEntry,
  getClashDetectionReport,
  getClashDetectionReportByEvent,
} = require('../../controllers/timeTable/timetable.controller.js');

const router = express.Router();

const assertOwnStudentId = (req, res, next) => {
  const paramId = req.params.student_id;
  if (req.user?.student_id && paramId && paramId !== req.user.student_id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view your own timetable',
    });
  }
  next();
};

// ==================== Student routes ====================
router.get(
  '/student/:student_id',
  requireStudent,
  assertOwnStudentId,
  getStudentTimetable
);

// ==================== COE routes (students blocked) ====================


router.get('/published/event/:event_id', getTimetableByEvent);

router.get('/', getAllTimetableEntries);
router.get('/date-range', getTimetableByDateRange);
router.get(
  '/branch/:branch_id/semester/:semester_id',
  getTimetableByBranchAndSemester
);
router.get('/event/:event_id', getTimetableByEvent);
router.get('/clash-report', getClashDetectionReport);
router.get('/clash-report/event/:event_id', getClashDetectionReportByEvent);
router.get('/:timetable_id', getTimetableEntryById);

router.post('/', createTimetableEntry);
router.post('/bulk', bulkCreateTimetableEntries);
router.post('/publish', publishTimetable);

router.put('/:timetable_id', updateTimetableEntry);
router.post('/:timetable_id/reschedule', rescheduleTimetableEntry);
router.patch('/:timetable_id/restore', restoreTimetableEntry);

router.delete('/:timetable_id', deleteTimetableEntry);

module.exports = router;
