const { z } = require('zod');

// Create COE validation schema
const createCOESchema = z.object({
  institution_id: z.string().uuid('institution_id must be a valid UUID'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  employee_id: z
    .string()
    .min(1, 'Employee ID is required')
    .max(100, 'Employee ID must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  phone_number: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 characters')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  qualification: z.string().max(255).optional().nullable(),
});

// Update COE validation schema
const updateCOESchema = z.object({
  institution_id: z.string().uuid('institution_id must be a valid UUID').optional(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  employee_id: z
    .string()
    .min(1, 'Employee ID is required')
    .max(100, 'Employee ID must be less than 100 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  phone_number: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .optional(),
  qualification: z.string().max(255).optional().nullable(),
  status: z.boolean().optional(),
});

// COE ID param validation
const coeIdParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

// Institution ID param for filtering COEs by institution
const institutionIdParamSchema = z.object({
  institutionId: z.string().uuid('institutionId must be a valid UUID'),
});

module.exports = {
  createCOESchema,
  updateCOESchema,
  coeIdParamSchema,
  // alias used by controller
  idParamSchema: coeIdParamSchema,
  institutionIdParamSchema,
};
