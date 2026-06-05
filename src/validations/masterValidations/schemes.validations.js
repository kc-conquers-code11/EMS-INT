const { z } = require('zod');

// Base schema for scheme
const schemeBaseSchema = {
  programm_id: z
    .string()
    .uuid('Programm ID must be a valid UUID'),
  scheme_name: z
    .string()
    .trim()
    .min(1, 'Scheme name is required')
    .max(255, 'Scheme name too long'),
  scheme_year: z
    .number()
    .int()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 5, 'Year too far in future'),
  description: z.string().trim().optional(),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  scheme_code: z.string().trim().max(100).optional(),
  scheme_type: z.string().trim().max(100).optional(),
  regulation: z.string().trim().max(100).optional(),
  applicable_from_year: z.string().trim().max(20).optional(),
  total_semesters: z.number().int().optional(),
  credit_system_type: z.string().trim().max(50).optional(),
  total_credits: z.number().int().optional(),
  grading_system: z.string().trim().max(50).optional(),
  branches: z.array(z.string().uuid('Invalid branch ID')).optional(),
};

// Create Scheme Validation
const createSchemeValidation = z.object({
  programm_id: schemeBaseSchema.programm_id,
  scheme_name: schemeBaseSchema.scheme_name,
  scheme_year: schemeBaseSchema.scheme_year,
  description: schemeBaseSchema.description,
  status: schemeBaseSchema.status,
  scheme_code: schemeBaseSchema.scheme_code,
  scheme_type: schemeBaseSchema.scheme_type,
  regulation: schemeBaseSchema.regulation,
  applicable_from_year: schemeBaseSchema.applicable_from_year,
  total_semesters: schemeBaseSchema.total_semesters,
  credit_system_type: schemeBaseSchema.credit_system_type,
  total_credits: schemeBaseSchema.total_credits,
  grading_system: schemeBaseSchema.grading_system,
  branches: schemeBaseSchema.branches,
});

// Update Scheme Validation (all fields optional)
const updateSchemeValidation = z
  .object({
    programm_id: schemeBaseSchema.programm_id.optional(),
    scheme_name: schemeBaseSchema.scheme_name.optional(),
    scheme_year: schemeBaseSchema.scheme_year.optional(),
    description: schemeBaseSchema.description.optional(),
    status: schemeBaseSchema.status.optional(),
    scheme_code: schemeBaseSchema.scheme_code.optional(),
    scheme_type: schemeBaseSchema.scheme_type.optional(),
    regulation: schemeBaseSchema.regulation.optional(),
    applicable_from_year: schemeBaseSchema.applicable_from_year.optional(),
    total_semesters: schemeBaseSchema.total_semesters.optional(),
    credit_system_type: schemeBaseSchema.credit_system_type.optional(),
    total_credits: schemeBaseSchema.total_credits.optional(),
    grading_system: schemeBaseSchema.grading_system.optional(),
    branches: schemeBaseSchema.branches.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// ID Parameter Validation
const idParamValidation = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
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
});

module.exports = {
  createSchemeValidation,
  updateSchemeValidation,
  idParamValidation,
  paginationValidation,
};
