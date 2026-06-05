const { z } = require('zod');

// Get pending registrations
const getPendingRegistrationsSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    reg_type: z.enum(['regular', 'backlog', 'improvement', 'late']).optional(),
    search: z.string().optional(),
});

// Get registration details for review
const getRegistrationForReviewSchema = z.object({
    exam_reg_id: z.number().int().positive(),
});

// Approve registration
const approveRegistrationSchema = z.object({
    exam_reg_id: z.number().int().positive(),
    approval_notes: z.string().max(500, 'Notes too long').optional(),
    fee_amount: z.number().positive().optional(),
});

// Reject registration
const rejectRegistrationSchema = z.object({
    exam_reg_id: z.number().int().positive(),
    rejection_reason: z.string().min(1, 'Rejection reason is required').max(500),
});

// Bulk approval
const bulkApproveSchema = z.object({
    exam_reg_ids: z.array(z.number().int().positive()).min(1, 'At least one registration ID required'),
    approval_notes: z.string().max(500).optional(),
});

// Bulk rejection
const bulkRejectSchema = z.object({
    exam_reg_ids: z.array(z.number().int().positive()).min(1),
    rejection_reason: z.string().min(1, 'Rejection reason is required'),
});

// Update fee
const updateFeeSchema = z.object({
    exam_reg_id: z.number().int().positive(),
    fee_amount: z.number().positive('Fee must be positive'),
});

module.exports = {
    getPendingRegistrationsSchema,
    getRegistrationForReviewSchema,
    approveRegistrationSchema,
    rejectRegistrationSchema,
    bulkApproveSchema,
    bulkRejectSchema,
    updateFeeSchema,
};