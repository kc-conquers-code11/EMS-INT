const express = require('express');
const {
  getAssignedSubjects,
  getMarksRoster,
  saveMarksDraft,
  lockMarks
} = require('../../controllers/faculty/marksEntry.controller');
// Use the shared auth middleware if available, but for now we'll assume it's mounted with verifyToken in app.js or similar.

const router = express.Router();

router.get('/subjects', getAssignedSubjects);
router.get('/roster/:mapping_id/:component', getMarksRoster);
router.post('/save', saveMarksDraft);
router.post('/lock', lockMarks);

module.exports = router;
