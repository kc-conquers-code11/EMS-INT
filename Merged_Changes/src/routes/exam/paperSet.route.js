const express = require('express');
const sequelize = require('../../config/db.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');
const { uploadQuestionPaper } = require('../../helpers/paperSetUpload.helper.js');
const {
  requestPaperSet,
  acceptPaperSet,
  uploadPaperSet,
  lockAndSubmitPaperSet,
  finalLockPaperSet,
  downloadPaperSet,
  getPaperSetById,
  listPaperSets,
  getPaperSetApprovalHistory,
  createPaperRequest,
  getRequestsByFaculty,
  getRequestsByCOE,
  savePaperDraft,
  reviewPaper,
} = require('../../controllers/exam/paperSet.controller.js');

const router = express.Router();

const attachDb = (req, res, next) => {
  req.db = {
    sequelize,
    Sequelize: require('sequelize'),
  };
  next();
};

const handleMulterError = (err, req, res, next) => {
  if (!err) return next();
  return res.status(400).json({
    success: false,
    message: err.message || 'File upload failed',
  });
};

router.use(verifyToken);
router.use(attachDb);

router.get('/', listPaperSets);
router.post('/request', requestPaperSet);

// --- Phase 2 Specific Routes ---
router.post('/create-paper-request', createPaperRequest);
router.get('/faculty/requests', getRequestsByFaculty);
router.get('/coe/requests', getRequestsByCOE);

router.get('/:set_id/download', downloadPaperSet);
router.get('/:set_id/history', getPaperSetApprovalHistory);
router.post('/:set_id/final-lock', finalLockPaperSet);

router.put('/:set_id/accept', acceptPaperSet);
router.post(
  '/:set_id/upload',
  (req, res, next) => {
    uploadQuestionPaper.single('file')(req, res, (err) =>
      handleMulterError(err, req, res, next)
    );
  },
  uploadPaperSet
);
router.post('/:set_id/save-draft', savePaperDraft);
router.put('/:set_id/lock-submit', lockAndSubmitPaperSet);
router.put('/:set_id/review', reviewPaper);

router.get('/:set_id', getPaperSetById);

module.exports = router;
