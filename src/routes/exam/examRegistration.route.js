// routes/student/examRegistration.route.js
const express = require('express');
const router = express.Router();
const examRegistrationController = require('../../controllers/exam/examRegistration.controller.js');
// Auth + requireStudent applied at app mount (/api/v1/exam-registration)

// Step 1-2: Discovery and type selection
router.get('/events', examRegistrationController.getAvailableEvents);
router.post('/eligible-subjects', examRegistrationController.getEligibleSubjects);

// Step 3-4: Subject selection and fee calculation
router.post('/calculate-fee', examRegistrationController.calculateFee);
router.post('/confirm', examRegistrationController.confirmRegistration);

// Step 5: Receipt generation
router.get('/receipt/:exam_reg_id', examRegistrationController.generateReceipt);

// Registration history and details
router.get('/history', examRegistrationController.getRegistrationHistory);
router.get('/:exam_reg_id', examRegistrationController.getRegistrationDetails);
module.exports = router;