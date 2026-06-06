const express = require('express');
const sequelize = require('../../config/db.js');
const { Op } = require('sequelize');
const initModels = require('../../models/init-models.js');

// Initialize all models with associations
const models = initModels(sequelize);

const {
  getAllExamPatterns,
  getExamPatternById,
  getExamPatternsByProgramme,
  createExamPattern,
  updateExamPattern,
  deleteExamPattern,
  permanentDeleteExamPattern,
  getDeletedExamPatterns,
  restoreExamPattern,
  getExamPatternsDropdown,
} = require('../../controllers/exam/examPattern.controller.js');

const router = express.Router();

// Middleware to attach db and models to request
const attachDb = (req, res, next) => {
  req.db = {
    models: models,
    Sequelize: require('sequelize'),
    Op: Op,
  };
  next();
};

router.use(attachDb);

// Public routes (dropdown - accessible after auth)
router.get('/dropdown', getExamPatternsDropdown);

// Main CRUD routes
router.get('/', getAllExamPatterns);
router.get('/deleted', getDeletedExamPatterns);
router.get('/programme/:id', getExamPatternsByProgramme);
router.get('/:pattern_id', getExamPatternById);

router.post('/', createExamPattern);
router.put('/:pattern_id', updateExamPattern);
router.delete('/:pattern_id', deleteExamPattern);
router.put('/:pattern_id/restore', restoreExamPattern);
router.delete('/:pattern_id/permanent', permanentDeleteExamPattern);

module.exports = router;
