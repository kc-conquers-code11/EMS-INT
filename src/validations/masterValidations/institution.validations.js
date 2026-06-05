const { z } = require('zod');

// Create institution validation schema
const createInstitutionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  institution_code: z.string().max(100).optional().nullable(),
  establishment_year: z.string().max(4).optional().nullable(),
  institution_type: z
    .string()
    .max(50, 'Type must be less than 50 characters')
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  road: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  pincode: z.string().max(10).optional().nullable(),
  logo: z
    .string()
    .max(500, 'Logo URL must be less than 500 characters')
    .optional()
    .nullable(),
  affiliated_university: z
    .string()
    .max(255, 'Affiliated university must be less than 255 characters')
    .optional()
    .nullable(),
  contact: z
    .string()
    .max(15, 'Contact must be less than 15 characters')
    .optional()
    .nullable(),
  phone_number: z.string().max(20).optional().nullable(),
  alternate_phone_number: z.string().max(20).optional().nullable(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .nullable(),
  official_email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Invalid website URL')
    .max(255, 'Website must be less than 255 characters')
    .optional()
    .nullable(),
  website_url: z.string().max(500).optional().nullable(),
  accreditation: z
    .object({
      nba: z.boolean().optional(),
      naac: z.boolean().optional(),
      aicte: z.boolean().optional(),
      other: z.array(z.object({ value: z.string() })).optional(),
    })
    .optional()
    .nullable(),
  courses: z
    .object({
      undergraduate: z.boolean().optional(),
      postgraduate: z.boolean().optional(),
      phd: z.boolean().optional(),
      other: z.array(z.object({ value: z.string() })).optional(),
    })
    .optional()
    .nullable(),
  status: z.boolean().default(true),
});

// Update institution validation schema (all fields optional)
const updateInstitutionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  institution_code: z.string().max(100).optional().nullable(),
  establishment_year: z.string().max(4).optional().nullable(),
  institution_type: z
    .string()
    .max(50, 'Type must be less than 50 characters')
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  road: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  pincode: z.string().max(10).optional().nullable(),
  logo: z
    .string()
    .max(500, 'Logo URL must be less than 500 characters')
    .optional()
    .nullable(),
  affiliated_university: z
    .string()
    .max(255, 'Affiliated university must be less than 255 characters')
    .optional()
    .nullable(),
  contact: z
    .string()
    .max(15, 'Contact must be less than 15 characters')
    .optional()
    .nullable(),
  phone_number: z.string().max(20).optional().nullable(),
  alternate_phone_number: z.string().max(20).optional().nullable(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .nullable(),
  official_email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Invalid website URL')
    .max(255, 'Website must be less than 255 characters')
    .optional()
    .nullable(),
  website_url: z.string().max(500).optional().nullable(),
  accreditation: z
    .object({
      nba: z.boolean().optional(),
      naac: z.boolean().optional(),
      aicte: z.boolean().optional(),
      other: z.array(z.object({ value: z.string() })).optional(),
    })
    .optional()
    .nullable(),
  courses: z
    .object({
      undergraduate: z.boolean().optional(),
      postgraduate: z.boolean().optional(),
      phd: z.boolean().optional(),
      other: z.array(z.object({ value: z.string() })).optional(),
    })
    .optional()
    .nullable(),
  status: z.boolean().optional(),
});

// ID param validation for UUID
const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

module.exports = {
  createInstitutionSchema,
  updateInstitutionSchema,
  idParamSchema,
};
