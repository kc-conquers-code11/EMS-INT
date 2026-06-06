const express = require('express');
const {
  getDepartmentSubjects,
  getLockedRoster,
  approveMarks,
  unlockMarks
} = require('../../controllers/hod/hodApproval.controller');

const router = express.Router();

router.get('/subjects', getDepartmentSubjects);
router.get('/audit/:mapping_id/:component', getLockedRoster);
router.post('/approve', approveMarks);
router.post('/unlock', unlockMarks);

module.exports = router;
