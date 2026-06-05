const { z } = require('zod');

// Create programme validation schema
const createProgrammeSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .min(1, 'Institution ID is required'),
  depart_id: z
    .string()
    .uuid('Department ID must be a valid UUID')
    .min(1, 'Department ID is required'),
  programme_name: z
    .string()
    .min(1, 'Programme name is required')
    .max(255, 'Programme name must be less than 255 characters'),
  programme_code: z
    .string()
    .max(20, 'Programme code must be less than 20 characters')
    .optional()
    .nullable(),
  degree_type: z
    .string()
    .max(50, 'Degree type must be less than 50 characters')
    .optional()
    .nullable(),
  duration_years: z
    .number()
    .int('Duration years must be an integer')
    .positive('Duration years must be positive')
    .optional()
    .nullable(),
  total_semesters: z
    .number()
    .int('Total semesters must be an integer')
    .positive('Total semesters must be positive')
    .optional()
    .nullable(),
  status: z.boolean().default(true),
  approved_intake: z
    .number()
    .int('Approved intake must be an integer')
    .nonnegative('Approved intake must be non-negative')
    .optional()
    .nullable(),
});

// Update programme validation schema
const updateProgrammeSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .optional(),
  depart_id: z.string().uuid('Department ID must be a valid UUID').optional(),
  programme_name: z
    .string()
    .min(1, 'Programme name is required')
    .max(255, 'Programme name must be less than 255 characters')
    .optional(),
  programme_code: z
    .string()
    .max(20, 'Programme code must be less than 20 characters')
    .optional()
    .nullable(),
  degree_type: z
    .string()
    .max(50, 'Degree type must be less than 50 characters')
    .optional()
    .nullable(),
  duration_years: z
    .number()
    .int('Duration years must be an integer')
    .positive('Duration years must be positive')
    .optional()
    .nullable(),
  total_semesters: z
    .number()
    .int('Total semesters must be an integer')
    .positive('Total semesters must be positive')
    .optional()
    .nullable(),
  status: z.boolean().optional(),
  approved_intake: z
    .number()
    .int('Approved intake must be an integer')
    .nonnegative('Approved intake must be non-negative')
    .optional()
    .nullable(),
});

// ID param validation for UUID
const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

// Programme ID param validation for UUID
const programmeIdParamSchema = z.object({
  programm_id: z.string().uuid('Programme ID must be a valid UUID'),
});

module.exports = {
  createProgrammeSchema,
  updateProgrammeSchema,
  idParamSchema,
  programmeIdParamSchema,
};
