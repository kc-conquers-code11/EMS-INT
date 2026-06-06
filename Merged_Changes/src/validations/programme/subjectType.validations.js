const { z } = require('zod');

// Base schema for subject type
const subjectTypeBaseSchema = {
  value: z
    .string()
    .trim()
    .min(1, 'Subject type value is required')
    .max(50, 'Subject type value cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/,
      'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign'
    )
    .transform((val) => val.trim()),
  new_value: z
    .string()
    .trim()
    .min(1, 'New subject type value is required')
    .max(50, 'Subject type value cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/,
      'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign'
    )
    .optional(),
  reassign_to: z
    .string()
    .trim()
    .max(50, 'Subject type value cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/,
      'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign'
    )
    .optional()
    .nullable(),
};

// Create Subject Type Validation
const createSubjectTypeValidation = z.object({
  value: subjectTypeBaseSchema.value,
});

// Update Subject Type Validation (rename)
const updateSubjectTypeValidation = z
  .object({
    new_value: subjectTypeBaseSchema.new_value,
  })
  .refine((data) => data.new_value, {
    message: 'new_value is required for update',
  });

// Delete Subject Type Validation
const deleteSubjectTypeValidation = z
  .object({
    reassign_to: subjectTypeBaseSchema.reassign_to,
  })
  .optional();

// Subject Type Value Parameter Validation
const subjectTypeValueParamValidation = z.object({
  value: z
    .string()
    .min(1, 'Subject type value is required')
    .max(50, 'Subject type value too long'),
});

// Pagination Query Validation
const paginationValidation = z.object({
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
  search: z
    .string()
    .optional()
    .transform((val) => val || ''),
});

// Subject Type Query Validation
const subjectTypeQueryValidation = z.object({
  include_used_only: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  include_deleted: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

// Bulk Update Validation
const bulkUpdateValidation = z.object({
  updates: z
    .array(
      z.object({
        subject_id: z.string().uuid('Subject ID must be a valid UUID'),
        subject_type: z
          .string()
          .min(1, 'Subject type is required')
          .max(50, 'Subject type too long')
          .regex(
            /^[a-zA-Z][a-zA-Z0-9\s\-_\+]*$/,
            'Invalid subject type format'
          ),
      })
    )
    .min(1, 'At least one update is required')
    .max(100, 'Cannot update more than 100 subjects at once'),
});

module.exports = {
  createSubjectTypeValidation,
  updateSubjectTypeValidation,
  deleteSubjectTypeValidation,
  subjectTypeValueParamValidation,
  paginationValidation,
  subjectTypeQueryValidation,
  bulkUpdateValidation,
};
