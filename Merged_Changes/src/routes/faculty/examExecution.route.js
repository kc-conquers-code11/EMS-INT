const express = require('express');
const {
  getBlockRoster,
  submitAttendance,
  reportCopyCase
} = require('../../controllers/faculty/examExecution.controller');

const router = express.Router();

router.get('/roster', getBlockRoster);
router.post('/attendance', submitAttendance);
router.post('/copy-case', reportCopyCase);

module.exports = router;
