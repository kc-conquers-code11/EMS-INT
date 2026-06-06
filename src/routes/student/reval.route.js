const express = require('express');
const router = express.Router();
const revalController = require('../../controllers/student/reval.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/eligible-subjects', revalController.getEligibleSubjects);
router.post('/apply', revalController.applyRevaluation);

module.exports = router;
