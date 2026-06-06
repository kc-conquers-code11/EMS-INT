const express = require('express');
const { validate } = require('../../middlewares/validate.js');
const {
  createBranchSchema,
  updateBranchSchema,
  branchIdParamSchema,
  idParamSchema,
} = require('../../validations/programme/branch.validations.js');
const {
  getAllBranches,
  getBranchById,
  getBranchesByProgramme,
  getBranchesByDepartment,
  createBranch,
  updateBranch,
  deleteBranch,
  permanentDeleteBranch,
  checkProgrammeBranches,
  getBranchesDropdown,
  getDeletedBranch,
  restoreBranch,
} = require('../../controllers/programme/branch.controller.js');

const router = express.Router();

router.get('/', getAllBranches);
router.get('/dropdown', getBranchesDropdown);
router.get('/programme/:id', validate(idParamSchema, 'params'), getBranchesByProgramme);
router.get('/department/:id', validate(idParamSchema, 'params'), getBranchesByDepartment);
router.get('/deleted', getDeletedBranch);
router.get('/:branch_id', validate(branchIdParamSchema, 'params'), getBranchById);

router.get('/programme/:id/check', validate(idParamSchema, 'params'), checkProgrammeBranches);
router.post('/', validate(createBranchSchema, 'body'), createBranch);
router.put('/:branch_id', validate(branchIdParamSchema, 'params'), validate(updateBranchSchema, 'body'), updateBranch);
router.delete('/:branch_id', validate(branchIdParamSchema, 'params'), deleteBranch);
router.put('/:branch_id/restore', validate(branchIdParamSchema, 'params'), restoreBranch);
router.delete('/:branch_id/permanent', validate(branchIdParamSchema, 'params'), permanentDeleteBranch);

module.exports = router;
