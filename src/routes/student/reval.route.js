const express = require('express');
const router = express.Router();
const revalController = require('../../controllers/student/reval.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

router.use(requireAuth);
router.use(requireRole('Student'));

router.get('/eligible-subjects', revalController.getEligibleSubjects);
router.post('/apply', revalController.applyRevaluation);

module.exports = router;
