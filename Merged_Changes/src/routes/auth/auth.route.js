const express = require('express');
const { login, logout, validateUser } = require('../../controllers/auth/auth.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.get('/validate', verifyToken, validateUser);

module.exports = router;
