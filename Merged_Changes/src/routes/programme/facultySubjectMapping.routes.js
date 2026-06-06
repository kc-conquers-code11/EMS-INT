const express = require('express');
const { requireHod } = require('../../middlewares/role.middleware.js');
const {
  listMappings,
  getSubjectMappingDetail,
  listFacultyLookup,
  listSemestersLookup,
  listSubjectsLookup,
  listMySubjects,
  createMapping,
  updateSubjectMapping,
  deleteMapping,
  getFacultyAllocationPanel,
  upsertFacultyMapping,
} = require('../../controllers/programme/facultySubjectMapping.controller.js');

const router = express.Router();

router.get('/my-subjects', listMySubjects);
router.get('/lookup/faculty', listFacultyLookup);
router.get('/lookup/semesters', listSemestersLookup);
router.get('/lookup/subjects', listSubjectsLookup);
router.get('/faculty/:faculty_id/allocation-panel', requireHod, getFacultyAllocationPanel);
router.get('/subject/:subject_id', getSubjectMappingDetail);
router.get('/', listMappings);

router.post('/', requireHod, createMapping);
router.put('/faculty/:faculty_id/mappings', requireHod, upsertFacultyMapping);
router.put('/subject/:subject_id', requireHod, updateSubjectMapping);
router.delete('/:id', requireHod, deleteMapping);

module.exports = router;
