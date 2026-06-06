const express = require('express');
const {
  getAssignedRevaluations,
  saveRevaluationDraft,
  lockRevaluation
} = require('../../controllers/faculty/revaluation.controller');

const router = express.Router();

router.get('/assigned', getAssignedRevaluations);
router.post('/save', saveRevaluationDraft);
router.post('/lock', lockRevaluation);

module.exports = router;
