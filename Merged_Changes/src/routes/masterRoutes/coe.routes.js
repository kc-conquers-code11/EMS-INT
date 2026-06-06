//src/routes/masterRoutes/coe.routes.js
const express = require('express');
const sequelize = require('../../config/db.js');
const { DataTypes, Op } = require('sequelize');
const institutionModel = require('../../models/institution.js');
const coeModel = require('../../models/coe.js');
const {
  verifyToken,
} = require('../../middlewares/auth.middleware.js');

// Initialize the models with sequelize
const Institution = institutionModel(sequelize, DataTypes);
const COE = coeModel(sequelize, DataTypes);

const {
  getAllCOEs,
  getCOEById,
  getCOEsByInstitution,
  createCOE,
  updateCOE,
  revealCOECredential,
  deleteCOE,
} = require('../../controllers/masterController/coe.controller.js');

const router = express.Router();

// Middleware to attach db to request
const attachDb = (req, res, next) => {
  req.db = {
    models: {
      coe: COE,
      institution: Institution,
    },
    sequelize: sequelize,
    Sequelize: require('sequelize'),
    Op: Op,
  };
  next();
};

router.use(verifyToken);
router.use(attachDb);

// GET all COEs
router.get('/', getAllCOEs);

// GET COEs by institution ID
router.get('/institution/:institutionId', getCOEsByInstitution);

// GET COE by ID
router.get('/:id', getCOEById);

// POST create new COE
router.post('/', createCOE);

// PUT update COE
router.put('/:id', updateCOE);

// POST reveal COE login credential (auth required; password never included in list APIs)
router.post('/:id/reveal-credential', revealCOECredential);

// DELETE soft delete COE
router.delete('/:id', deleteCOE);

module.exports = router;
