const { z } = require('zod');

const createExamFeeSchema = z.object({
  programme_id: z
    .string()
    .uuid('Programme ID must be a valid UUID')
    .min(1, 'Programme ID is required'),
  semester_id: z
    .string()
    .uuid('Semester ID must be a valid UUID')
    .min(1, 'Semester ID is required'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be positive'),
  late_fee: z
    .number()
    .nonnegative('Late fee must be non-negative')
    .optional()
    .nullable(),
});

const updateExamFeeSchema = z
  .object({
    programme_id: z
      .string()
      .uuid('Programme ID must be a valid UUID')
      .optional(),
    semester_id: z.string().uuid('Semester ID must be a valid UUID').optional(),
    amount: z.number().positive('Amount must be positive').optional(),
    late_fee: z
      .number()
      .nonnegative('Late fee must be non-negative')
      .optional()
      .nullable(),
  })
  .refine(
    (data) =>
      data.programme_id !== undefined ||
      data.semester_id !== undefined ||
      data.amount !== undefined ||
      data.late_fee !== undefined,
    {
      message: 'At least one field to update must be provided',
    }
  );

const feeIdParamSchema = z.object({
  fee_id: z.string().uuid('Fee ID must be a valid UUID'),
});

const listExamFeesQuerySchema = z.object({
  programme_id: z.string().uuid('Programme ID must be a valid UUID').optional(),
  semester_id: z.string().uuid('Semester ID must be a valid UUID').optional(),
  is_late: z
    .enum(['true', 'false'], {
      errorMap: () => ({ message: "is_late must be 'true' or 'false'" }),
    })
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
});

module.exports = {
  createExamFeeSchema,
  updateExamFeeSchema,
  feeIdParamSchema,
  listExamFeesQuerySchema,
};
