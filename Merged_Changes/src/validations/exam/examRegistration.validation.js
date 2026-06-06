const { z } = require('zod');

// Step 1: Get available exam events
const getExamEventsSchema = z.object({
    semester_id: z.string().uuid('Invalid semester ID').optional(),
    exam_type: z.string().optional(),
});

// Step 2: Select registration type
const selectRegistrationTypeSchema = z.object({
    event_id: z.string().uuid('Event ID must be a valid UUID'),
    reg_type: z.enum(['regular', 'backlog', 'improvement', 'late']),
});

// Step 3: Select subjects for exam
const selectSubjectsSchema = z.object({
    event_id: z.string().uuid('Event ID must be a valid UUID'),
    reg_type: z.enum(['regular', 'backlog', 'improvement', 'late']),
    subjects: z.array(z.object({
        mapping_id: z.number().int().positive('Invalid mapping ID'),
        subject_type: z.enum(['regular', 'backlog', 'improvement']).default('regular'),
    })).min(1, 'At least one subject must be selected'),
});

// Step 4: Validate and calculate fee
const validateFeeSchema = z.object({
    event_id: z.string().uuid('Event ID must be a valid UUID'),
    reg_type: z.enum(['regular', 'backlog', 'improvement', 'late']),
    subjects: z.array(z.object({
        mapping_id: z.number().int().positive(),
        subject_type: z.enum(['regular', 'backlog', 'improvement']),
    })),
});

// Step 5: Confirm registration
const confirmRegistrationSchema = z.object({
    event_id: z.string().uuid('Event ID must be a valid UUID'),
    reg_type: z.enum(['regular', 'backlog', 'improvement', 'late']),
    subjects: z.array(z.object({
        mapping_id: z.number().int().positive(),
        subject_type: z.enum(['regular', 'backlog', 'improvement']),
    })),
    fee_amount: z.number().positive('Fee amount must be positive'),
    payment_method: z.enum(['online', 'offline', 'bank_transfer']).optional(),
});

// Step 6: Generate receipt
const generateReceiptSchema = z.object({
    exam_reg_id: z.number().int().positive(),
});

// Get registration status
const getRegistrationStatusSchema = z.object({
    event_id: z.string().uuid('Event ID must be a valid UUID').optional(),
});

// Get single registration details
const getRegistrationDetailsSchema = z.object({
    exam_reg_id: z.number().int().positive(),
});

module.exports = {
    getExamEventsSchema,
    selectRegistrationTypeSchema,
    selectSubjectsSchema,
    validateFeeSchema,
    confirmRegistrationSchema,
    generateReceiptSchema,
    getRegistrationStatusSchema,
    getRegistrationDetailsSchema,
};