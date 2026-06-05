const express = require('express');
const {
  mapCoPo,
  getCoPoMapping,
} = require('../../controllers/programme/coPoMapping.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

const router = express.Router();

router.use(verifyToken);

router.post('/', mapCoPo);
router.get('/subject/:subject_id', getCoPoMapping);

module.exports = router;
