// routes/admin/examApproval.route.js
const express = require('express');
const router = express.Router();
const examApprovalController = require('../../controllers/admin/examApproval.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

// All routes require authentication and admin role
router.use(verifyToken);

// Dashboard and listing
router.get('/pending', examApprovalController.getPendingRegistrations);
router.get('/stats', examApprovalController.getDashboardStats);

// Single registration review
router.get('/:exam_reg_id', examApprovalController.getRegistrationForReview);

// Approval actions
router.post('/approve', examApprovalController.approveRegistration);
router.post('/reject', examApprovalController.rejectRegistration);
router.post('/bulk-approve', examApprovalController.bulkApprove);
router.post('/bulk-reject', examApprovalController.bulkReject);

// Fee management
router.put('/update-fee', examApprovalController.updateFee);

module.exports = router;