// controllers/admin/examApprovalController.js
const { ZodError } = require('zod');
const ExamApprovalService = require('../../services/admin/examApproval.service.js');
const {
    getPendingRegistrationsSchema,
    getRegistrationForReviewSchema,
    approveRegistrationSchema,
    rejectRegistrationSchema,
    bulkApproveSchema,
    bulkRejectSchema,
    updateFeeSchema,
} = require('../../validations/admin/examApproval.validations.js');

// Get pending registrations dashboard
const getPendingRegistrations = async (req, res) => {
    try {
        const { page, limit, reg_type, search } = getPendingRegistrationsSchema.parse(req.query);

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.getPendingRegistrations(
            { reg_type, search },
            page,
            limit
        );

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: 'Pending registrations retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getPendingRegistrations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get registration details for review
const getRegistrationForReview = async (req, res) => {
    try {
        const { exam_reg_id } = getRegistrationForReviewSchema.parse(req.params);

        const approvalService = new ExamApprovalService(req.db);
        const details = await approvalService.getRegistrationForReview(exam_reg_id);

        res.status(200).json({
            success: true,
            data: details,
            message: 'Registration details retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getRegistrationForReview:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Approve a registration
const approveRegistration = async (req, res) => {
    try {
        const { exam_reg_id, approval_notes, fee_amount } = approveRegistrationSchema.parse(req.body);
        const adminId = req.user.uid;

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.approveRegistration(
            exam_reg_id,
            adminId,
            approval_notes,
            fee_amount
        );

        res.status(200).json({
            success: true,
            data: result,
            message: result.message,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in approveRegistration:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Reject a registration
const rejectRegistration = async (req, res) => {
    try {
        const { exam_reg_id, rejection_reason } = rejectRegistrationSchema.parse(req.body);
        const adminId = req.user.uid;

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.rejectRegistration(
            exam_reg_id,
            adminId,
            rejection_reason
        );

        res.status(200).json({
            success: true,
            data: result,
            message: result.message,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in rejectRegistration:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Bulk approve registrations
const bulkApprove = async (req, res) => {
    try {
        const { exam_reg_ids, approval_notes } = bulkApproveSchema.parse(req.body);
        const adminId = req.user.uid;

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.bulkApprove(exam_reg_ids, adminId, approval_notes);

        res.status(200).json({
            success: true,
            data: result,
            message: `Successfully approved ${result.success_count} out of ${exam_reg_ids.length} registrations`,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in bulkApprove:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Bulk reject registrations
const bulkReject = async (req, res) => {
    try {
        const { exam_reg_ids, rejection_reason } = bulkRejectSchema.parse(req.body);
        const adminId = req.user.uid;

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.bulkReject(exam_reg_ids, adminId, rejection_reason);

        res.status(200).json({
            success: true,
            data: result,
            message: `Successfully rejected ${result.success_count} out of ${exam_reg_ids.length} registrations`,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in bulkReject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Update registration fee
const updateFee = async (req, res) => {
    try {
        const { exam_reg_id, fee_amount } = updateFeeSchema.parse(req.body);
        const adminId = req.user.uid;

        const approvalService = new ExamApprovalService(req.db);
        const result = await approvalService.updateFee(exam_reg_id, adminId, fee_amount);

        res.status(200).json({
            success: true,
            data: result,
            message: result.message,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in updateFee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const approvalService = new ExamApprovalService(req.db);
        const stats = await approvalService.getDashboardStats();

        res.status(200).json({
            success: true,
            data: stats,
            message: 'Dashboard statistics retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    getPendingRegistrations,
    getRegistrationForReview,
    approveRegistration,
    rejectRegistration,
    bulkApprove,
    bulkReject,
    updateFee,
    getDashboardStats,
};