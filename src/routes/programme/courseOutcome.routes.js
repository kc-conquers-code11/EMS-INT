const express = require('express');
const {
  createCO,
  getCOsBySubject,
  updateCO,
  deleteCO,
} = require('../../controllers/programme/courseOutcome.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

const router = express.Router();

router.use(verifyToken);

router.post('/', createCO);
router.get('/subject/:subject_id', getCOsBySubject);
router.put('/:co_id', updateCO);
router.delete('/:co_id', deleteCO);

module.exports = router;
