const { z } = require('zod');

// Create branch validation schema
const createBranchSchema = z.object({
  programm_id: z
    .string()
    .uuid('Programme ID must be a valid UUID')
    .min(1, 'Programme ID is required'),
  depart_id: z
    .string()
    .uuid('Department ID must be a valid UUID')
    .min(1, 'Department ID is required'),
  branch_name: z
    .string()
    .min(1, 'Branch name is required')
    .max(200, 'Branch name must be less than 200 characters'),
  branch_code: z
    .string()
    .max(20, 'Branch code must be less than 20 characters')
    .optional()
    .nullable(),
  total_intake: z
    .number()
    .int('Total intake must be an integer')
    .nonnegative('Total intake must be non-negative')
    .optional()
    .nullable(),
  accreditation_status: z
    .string()
    .max(100, 'Accreditation status must be less than 100 characters')
    .optional()
    .nullable(),
  status: z.boolean().default(true),
  established_year: z
    .number()
    .int('Established year must be an integer')
    .positive('Established year must be positive')
    .optional()
    .nullable(),
});

// Update branch validation schema
const updateBranchSchema = z.object({
  programm_id: z.string().uuid('Programme ID must be a valid UUID').optional(),
  depart_id: z.string().uuid('Department ID must be a valid UUID').optional(),
  branch_name: z
    .string()
    .min(1, 'Branch name is required')
    .max(200, 'Branch name must be less than 200 characters')
    .optional(),
  branch_code: z
    .string()
    .max(20, 'Branch code must be less than 20 characters')
    .optional()
    .nullable(),
  total_intake: z
    .number()
    .int('Total intake must be an integer')
    .nonnegative('Total intake must be non-negative')
    .optional()
    .nullable(),
  accreditation_status: z
    .string()
    .max(100, 'Accreditation status must be less than 100 characters')
    .optional()
    .nullable(),
  status: z.boolean().optional(),
  established_year: z
    .number()
    .int('Established year must be an integer')
    .positive('Established year must be positive')
    .optional()
    .nullable(),
});

// ID param validation for UUID
const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

// Branch ID param validation for UUID
const branchIdParamSchema = z.object({
  branch_id: z.string().uuid('Branch ID must be a valid UUID'),
});

module.exports = {
  createBranchSchema,
  updateBranchSchema,
  idParamSchema,
  branchIdParamSchema,
};
