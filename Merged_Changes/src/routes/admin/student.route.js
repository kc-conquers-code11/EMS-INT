const express = require('express');
const sequelize = require('../../config/db.js');
const { Sequelize, Op } = require('sequelize');
const initModels = require('../../models/init-models.js');
const models = initModels(sequelize);
const studentController = require('../../controllers/admin/student.controller.js');

const router = express.Router();

const attachDb = (req, res, next) => {
  req.db = { models, Sequelize, Op };
  next();
};

router.use(attachDb);

router.get('/', studentController.getAllStudents);
router.get('/deleted', studentController.getDeletedStudents);
router.get('/:sid', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:sid', studentController.updateStudent);
router.delete('/:sid', studentController.deleteStudent);
router.get('/:sid/check', studentController.checkStudent);
router.put('/:sid/restore', studentController.restoreStudent);
router.delete('/:sid/permanent', studentController.permanentDeleteStudent);

module.exports = router;
