const express = require('express');
const router = express.Router();
const revalAssignmentController = require('../../controllers/coe/revalAssignment.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

router.use(requireAuth);
router.use(requireRole('COE'));

router.get('/applications', revalAssignmentController.getApplications);
router.post('/assign', revalAssignmentController.assignFaculty);

module.exports = router;
