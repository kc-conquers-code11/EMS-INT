const { z } = require('zod');

// Base schema for semester validation
const semesterBaseSchema = {
  programme_id: z
    .string()
    .uuid('Programme ID must be a valid UUID')
    .min(1, 'Programme ID is required'),
  academic_id: z
    .string()
    .uuid('Academic ID must be a valid UUID')
    .min(1, 'Academic ID is required'),
  branch_id: z
    .string()
    .uuid('Branch ID must be a valid UUID')
    .optional()
    .nullable(),
  scheme_id: z
    .string()
    .uuid('Scheme ID must be a valid UUID')
    .optional()
    .nullable(),
  total_subjects: z
    .number()
    .int('Total subjects must be an integer')
    .nonnegative('Total subjects must be non-negative')
    .optional()
    .nullable(),
  total_credits: z
    .number()
    .int('Total credits must be an integer')
    .nonnegative('Total credits must be non-negative')
    .optional()
    .nullable(),
  semester_number: z
    .number()
    .int('Semester number must be an integer')
    .positive('Semester number must be positive')
    .min(1, 'Semester number is required')
    .max(12, 'Semester number cannot exceed 12'),
  term_type: z
    .string()
    .trim()
    .min(1, 'Term is required')
    .max(10, 'Term must be less than 10 characters')
    .regex(
      /^(odd|even|summer|winter)$/i,
      'Term must be odd, even, summer, or winter'
    ),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
  is_active: z.boolean().default(false),
};

// Create Semester Validation Schema
const createSemesterValidation = z
  .object({
    programme_id: semesterBaseSchema.programme_id,
    academic_id: semesterBaseSchema.academic_id,
    branch_id: semesterBaseSchema.branch_id,
    scheme_id: semesterBaseSchema.scheme_id,
    total_subjects: semesterBaseSchema.total_subjects,
    total_credits: semesterBaseSchema.total_credits,
    semester_number: semesterBaseSchema.semester_number,
    term_type: semesterBaseSchema.term_type,
    start_date: semesterBaseSchema.start_date,
    end_date: semesterBaseSchema.end_date,
    is_active: semesterBaseSchema.is_active,
  })
  .refine(
    (data) => {
      // Validate that end_date is after start_date if both are provided
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  );

// Update Semester Validation Schema (all fields optional)
const updateSemesterValidation = z
  .object({
    programme_id: semesterBaseSchema.programme_id.optional(),
    academic_id: semesterBaseSchema.academic_id.optional(),
    branch_id: semesterBaseSchema.branch_id.optional(),
    scheme_id: semesterBaseSchema.scheme_id.optional(),
    total_subjects: semesterBaseSchema.total_subjects.optional(),
    total_credits: semesterBaseSchema.total_credits.optional(),
    semester_number: semesterBaseSchema.semester_number.optional(),
    term_type: semesterBaseSchema.term_type.optional(),
    start_date: semesterBaseSchema.start_date,
    end_date: semesterBaseSchema.end_date,
    is_active: semesterBaseSchema.is_active.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })
  .refine(
    (data) => {
      // Validate that end_date is after start_date if both are provided
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  );

// Semester ID Parameter Validation
const semesterIdParamValidation = z.object({
  semester_id: z.string().uuid('Semester ID must be a valid UUID'),
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

// Programme ID Query Validation
const programmeIdQueryValidation = z.object({
  programme_id: z.string().uuid('Programme ID must be a valid UUID'),
});

// Academic Year ID Query Validation
const academicIdQueryValidation = z.object({
  academic_id: z
    .string()
    .uuid('Academic ID must be a valid UUID'),
});

// Semester Status Update Validation
const updateSemesterStatusValidation = z.object({
  is_active: z.boolean({
    required_error: 'is_active field is required',
    invalid_type_error: 'is_active must be a boolean',
  }),
});

module.exports = {
  createSemesterValidation,
  updateSemesterValidation,
  semesterIdParamValidation,
  paginationValidation,
  programmeIdQueryValidation,
  academicIdQueryValidation,
  updateSemesterStatusValidation,
};
