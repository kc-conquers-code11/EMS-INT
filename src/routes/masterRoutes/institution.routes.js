const express = require('express');
const sequelize = require('../../config/db.js');
const { DataTypes, Op } = require('sequelize');
const institutionModel = require('../../models/institution.js');
const departmentModel = require('../../models/department.js');
const {
  verifyToken,
  authorizePermissions,
} = require('../../middlewares/auth.middleware.js');
const { requireSuperAdmin } = require('../../middlewares/role.middleware.js');

// Initialize the model with sequelize
const Institution = institutionModel(sequelize, DataTypes);
const Department = departmentModel(sequelize, DataTypes);

const {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  permanentDeleteInstitution,
} = require('../../controllers/masterController/institution.controller.js');

const router = express.Router();

// Middleware to attach db to request
const attachDb = (req, res, next) => {
  req.db = {
    models: {
      institution: Institution,
      department: Department,
    },
    sequelize: sequelize,
    Sequelize: require('sequelize'),
    Op: Op,
  };
  next();
};

router.use(verifyToken);
router.use(attachDb);

// GET all institutions
router.get('/', getAllInstitutions);

// GET institution by ID
router.get('/:id', getInstitutionById);

// POST create new institution — Super Admin only
router.post('/', requireSuperAdmin, createInstitution);

// PUT update institution
router.put('/:id', updateInstitution);

// DELETE soft delete institution (with department check) — Super Admin only
router.delete('/:id', requireSuperAdmin, deleteInstitution);

// DELETE permanent delete institution (with department check) — Super Admin only
router.delete('/:id/permanent', requireSuperAdmin, permanentDeleteInstitution);

module.exports = router;
