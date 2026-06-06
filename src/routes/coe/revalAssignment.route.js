const express = require('express');
const router = express.Router();
const revalAssignmentController = require('../../controllers/coe/revalAssignment.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/applications', revalAssignmentController.getApplications);
router.post('/assign', revalAssignmentController.assignFaculty);

module.exports = router;
