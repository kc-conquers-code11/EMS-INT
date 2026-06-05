const express = require('express');
const {
  createPO,
  getPOsByProgramme,
  updatePO,
  deletePO,
} = require('../../controllers/masterController/programmeOutcome.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

const router = express.Router();

router.use(verifyToken);

router.post('/', createPO);
router.get('/programme/:programm_id', getPOsByProgramme);
router.put('/:po_id', updatePO);
router.delete('/:po_id', deletePO);

module.exports = router;
