const express = require('express');
const {
  verifyToken,
  authorizePermissions,
} = require('../../middlewares/auth.middleware.js');
const {
  getAllSubjectMappings,
  getSubjectMappingById,
  getMappingsBySemester,
  getMappingsByBranch,
  getMappingsBySemesterAndBranch,
  getUnmappedSubjects,
  createSubjectMapping,
  bulkCreateSubjectMappings,
  updateSubjectMapping,
  deleteSubjectMapping,
  restoreSubjectMapping,
  permanentDeleteSubjectMapping,
} = require('../../controllers/programme/subjectMapping.controller.js');

const router = express.Router();

// All routes require authentication and Admin role
router.use(verifyToken);

// ==================== GET ROUTES ====================
router.get('/', getAllSubjectMappings);
router.get('/semester/:id', getMappingsBySemester);
router.get('/branch/:id', getMappingsByBranch);
router.get(
  '/semester/:semester_id/branch/:branch_id',
  getMappingsBySemesterAndBranch
);
router.get(
  '/unmapped/semester/:semester_id/branch/:branch_id',
  getUnmappedSubjects
);
router.get('/:mapping_id', getSubjectMappingById);

// ==================== POST ROUTES ====================
router.post('/', createSubjectMapping);
router.post('/bulk', bulkCreateSubjectMappings);

// ==================== PUT/PATCH ROUTES ====================
router.put('/:mapping_id', updateSubjectMapping);
router.patch('/:mapping_id/restore', restoreSubjectMapping);

// ==================== DELETE ROUTES ====================
router.delete('/:mapping_id', deleteSubjectMapping);
router.delete('/:mapping_id/permanent', permanentDeleteSubjectMapping);

module.exports = router;
