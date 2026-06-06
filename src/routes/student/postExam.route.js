const express = require('express');
const router = express.Router();
const postExamController = require('../../controllers/student/postExam.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/eligible-subjects', postExamController.getEligibleSubjects);
router.post('/reassessment/apply', postExamController.applyReassessment);
router.post('/photocopy/apply', postExamController.applyPhotocopy);

module.exports = router;
