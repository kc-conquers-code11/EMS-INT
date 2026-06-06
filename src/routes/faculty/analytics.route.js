const express = require('express');
const {
  getMarksheetVerification,
  getCOPOAttainment
} = require('../../controllers/faculty/analytics.controller');

const router = express.Router();

router.get('/marksheet/:mapping_id', getMarksheetVerification);
router.get('/copo-attainment/:mapping_id', getCOPOAttainment);

module.exports = router;
