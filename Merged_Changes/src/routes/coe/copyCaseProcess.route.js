const express = require('express');
const {
  getAllCopyCases,
  resolveCopyCase
} = require('../../controllers/coe/copyCaseProcess.controller');

const router = express.Router();

router.get('/', getAllCopyCases);
router.put('/:case_id/resolve', resolveCopyCase);

module.exports = router;
