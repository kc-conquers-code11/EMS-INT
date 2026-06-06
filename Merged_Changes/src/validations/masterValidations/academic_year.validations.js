const { z } = require('zod');

// Base schema for academic year
const academicYearBaseSchema = {
  academic_name: z
    .string()
    .trim()
    .min(1, 'Academic name is required')
    .max(10, 'Academic name too long'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  is_admission: z.number().int().min(0).max(1).default(0),
  current_ay: z.number().int().min(0).max(1).default(0),
};

// Create Academic Year Validation
const createAcademicYearValidation = z.object({
  academic_name: academicYearBaseSchema.academic_name,
  start_date: academicYearBaseSchema.start_date,
  end_date: academicYearBaseSchema.end_date,
  is_admission: academicYearBaseSchema.is_admission,
  current_ay: academicYearBaseSchema.current_ay,
}).refine((data) => new Date(data.start_date) < new Date(data.end_date), {
  message: 'Start date must be before end date',
});

// Update Academic Year Validation (all fields optional)
const updateAcademicYearValidation = z
  .object({
    academic_name: academicYearBaseSchema.academic_name.optional(),
    start_date: academicYearBaseSchema.start_date.optional(),
    end_date: academicYearBaseSchema.end_date.optional(),
    is_admission: academicYearBaseSchema.is_admission.optional(),
    current_ay: academicYearBaseSchema.current_ay.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })
  .refine((data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) < new Date(data.end_date);
    }
    return true;
  }, {
    message: 'Start date must be before end date',
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
  createAcademicYearValidation,
  updateAcademicYearValidation,
  idParamValidation,
  paginationValidation,
};
