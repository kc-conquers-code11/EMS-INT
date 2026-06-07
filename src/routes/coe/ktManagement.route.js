const express = require('express');
const router = express.Router();
const ktManagementController = require('../../controllers/coe/ktManagement.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.use(verifyToken);
// Assuming COE role check is handled upstream or can be added if required

router.post('/detect', ktManagementController.runKTDetection);
router.get('/eligibility', ktManagementController.getEligibilityRecords);
router.get('/registrations', ktManagementController.getKTRegistrations);
router.post('/evaluate-drops', ktManagementController.evaluateYearDrops);

module.exports = router;
