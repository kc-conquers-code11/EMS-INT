const express = require('express');
const sequelize = require('../../config/db.js');
const { DataTypes, Op } = require('sequelize');
const initModels = require('../../models/init-models.js');

// Initialize all models with associations
const models = initModels(sequelize);

const {
  getAllSubjects,
  getSubjectById,
  getSubjectsByScheme,
  getSubjectsByBranch,
  getSubjectsBySemester,
  createSubject,
  updateSubject,
  deleteSubject,
  permanentDeleteSubject,
  getSubjectsDropdown,
  getDeletedSubjects,
  restoreSubject,
  bulkCreateSubjects,
} = require('../../controllers/programme/subject.controller.js');

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

// ==================== GET ROUTES ====================

// Get all subjects (with filters)
router.get('/', getAllSubjects);

// Get subjects dropdown (for form selects)
router.get('/dropdown', getSubjectsDropdown);

// Get deleted subjects (soft deleted)
router.get('/deleted', getDeletedSubjects);

// Get subjects by scheme ID
router.get('/scheme/:id', getSubjectsByScheme);

// Get subjects by branch ID
router.get('/branch/:id', getSubjectsByBranch);

// Get subjects by semester (within a scheme)
router.get('/scheme/:scheme_id/semester/:sem', getSubjectsBySemester);

// Get single subject by ID
router.get('/:subject_id', getSubjectById);

// ==================== POST ROUTES ====================

// Create new subject
router.post('/', createSubject);

// Bulk create subjects
router.post('/bulk', bulkCreateSubjects);

// ==================== PUT/PATCH ROUTES ====================

// Update subject
router.put('/:subject_id', updateSubject);
// Alternative: router.patch('/:subject_id', updateSubject);

// ==================== DELETE ROUTES ====================

// Soft delete subject
router.delete('/:subject_id', deleteSubject);

// Permanently delete subject (hard delete)
router.delete('/:subject_id/permanent', permanentDeleteSubject);

// Restore soft deleted subject
router.patch('/:subject_id/restore', restoreSubject);

module.exports = router;
