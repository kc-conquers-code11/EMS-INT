// routes/student/registration.route.js
const express = require('express');
const router = express.Router();
const registrationController = require('../../controllers/studentcontroller/registration.controller.js');
const { tempTokenAuth } = require('../../middlewares/tempTokenAuth.middleware.js');

// Public routes (no authentication required)
router.post('/request-otp', registrationController.requestOTP);
router.post('/verify-otp', registrationController.verifyOTP);

// Protected routes (require temporary token from OTP verification)
router.post('/register', tempTokenAuth, registrationController.register);
// router.post('/confirm', tempTokenAuth, registrationController.confirmRegistration); // Deprecated - confirm now done in /register
router.get('/status', tempTokenAuth, registrationController.getRegistrationStatus);

module.exports = router;