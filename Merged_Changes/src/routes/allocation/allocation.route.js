const express = require('express');

const router = express.Router();

router.use('/blocks', require('./blockAllocation.route'));
router.use('/supervisors', require('./supervisorAllocation.route'));
router.use('/seats', require('./studentSeating.route'));

module.exports = router;
