const { z } = require('zod');

// Create department validation schema
const createDepartmentSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .min(1, 'Institution ID is required'),
  depart_name: z
    .string()
    .min(1, 'Department name is required')
    .max(200, 'Department name must be less than 200 characters'),
  depart_code: z
    .string()
    .max(20, 'Department code must be less than 20 characters')
    .optional()
    .nullable(),
  hod_id: z
    .string()
    .uuid('HOD ID must be a valid UUID')
    .optional()
    .nullable(),
  total_faculties: z.coerce.number().int().nonnegative().optional(),
  total_students: z.coerce.number().int().nonnegative().optional(),
  courses_offered: z.record(z.boolean()).optional(),
  workflow_status: z.enum(['DRAFT', 'ACTIVE']).optional(),
  status: z.boolean().default(true),
});

// Update department validation schema
const updateDepartmentSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .optional(),
  depart_name: z
    .string()
    .min(1, 'Department name is required')
    .max(200, 'Department name must be less than 200 characters')
    .optional(),
  depart_code: z
    .string()
    .max(20, 'Department code must be less than 20 characters')
    .optional()
    .nullable(),
  hod_id: z
    .string()
    .uuid('HOD ID must be a valid UUID')
    .optional()
    .nullable(),
  total_faculties: z.coerce.number().int().nonnegative().optional(),
  total_students: z.coerce.number().int().nonnegative().optional(),
  courses_offered: z.record(z.boolean()).optional(),
  workflow_status: z.enum(['DRAFT', 'ACTIVE']).optional(),
  status: z.boolean().optional(),
});

// ID param validation for UUID
const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

// Department ID param validation for UUID
const departmentIdParamSchema = z.object({
  depart_id: z.string().uuid('Department ID must be a valid UUID'),
});

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
  idParamSchema,
  departmentIdParamSchema,
};
