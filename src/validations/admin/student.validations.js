const { z } = require('zod');

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only digits'),
});

const createStudentSchema = z.object({
  student: z.object({
    gr_number: z.string().min(1, 'GR Number is required'),
    branch_id: z.string().min(1, 'Invalid branch ID'),
    programm_id: z.string().min(1, 'Invalid programme ID'),
    academic_year: z.string().min(1, 'Academic year is required'),
  }),
  personal: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
    gender: z.enum(['Male', 'Female', 'Other']),
    email: z.email('Invalid email format'),
    contact: z
      .string()
      .length(10, 'Contact must be exactly 10 digits')
      .regex(/^\d{10}$/, 'Contact must contain only digits'),
  }),
  permanent_address: addressSchema,
  residential_address: addressSchema,
  parent: z.object({
    father_name: z.string().min(1, "Father's name is required"),
    father_contact: z
      .string()
      .length(10, "Father's contact must be exactly 10 digits")
      .regex(/^\d{10}$/, 'Contact must contain only digits'),
    mother_name: z.string().optional(),
    mother_contact: z
      .string()
      .length(10, 'Mother contact must be exactly 10 digits')
      .regex(/^\d{10}$/, 'Contact must contain only digits')
      .optional(),
  }),
});

const updateStudentSchema = z.object({
  student: z
    .object({
      gr_number: z.string().min(1).optional(),
      branch_id: z.uuid('Invalid branch ID').optional(),
      programm_id: z.uuid('Invalid programme ID').optional(),
      academic_year: z.string().min(1).optional(),
    })
    .optional(),
  personal: z
    .object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      dob: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)))
        .optional(),
      gender: z.enum(['Male', 'Female', 'Other']).optional(),
      email: z.email().optional(),
      contact: z
        .string()
        .length(10)
        .regex(/^\d{10}$/)
        .optional(),
    })
    .optional(),
  permanent_address: addressSchema.partial().optional(),
  residential_address: addressSchema.partial().optional(),
  parent: z
    .object({
      father_name: z.string().min(1).optional(),
      father_contact: z
        .string()
        .length(10)
        .regex(/^\d{10}$/)
        .optional(),
      mother_name: z.string().optional(),
      mother_contact: z
        .string()
        .length(10)
        .regex(/^\d{10}$/)
        .optional(),
    })
    .optional(),
});

const sidParamSchema = z.object({
  sid: z.string().min(1, 'Invalid student ID'),
});

module.exports = { createStudentSchema, updateStudentSchema, sidParamSchema };
