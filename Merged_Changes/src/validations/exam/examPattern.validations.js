const { z } = require('zod');

// Create exam pattern validation schema
const createExamPatternSchema = z.object({
  programm_id: z
    .string()
    .uuid('Programme ID must be a valid UUID')
    .min(1, 'Programme ID is required'),
  pattern_name: z
    .string()
    .min(1, 'Pattern name is required')
    .max(200, 'Pattern name must be less than 200 characters'),
  grading_type: z
    .enum(['absolute', 'relative', 'cgpa', 'percentage'], {
      message:
        'Grading type must be one of: absolute, relative, cgpa, percentage',
    })
    .optional()
    .default('absolute'),
  grace_marks_allowed: z
    .number()
    .int('Grace marks allowed must be an integer')
    .min(0, 'Grace marks allowed cannot be negative')
    .optional()
    .default(0),
  grace_marks_max: z
    .number()
    .int('Grace marks max must be an integer')
    .min(0, 'Grace marks max cannot be negative')
    .optional()
    .default(0),
  atkt_rule: z.string().optional().nullable(),
  rounding_rule: z
    .string()
    .max(100, 'Rounding rule must be less than 100 characters')
    .optional()
    .nullable(),
  passing_criteria: z.string().optional().nullable(),
  detention_criteria: z.string().optional().nullable(),
  status: z.boolean().default(true),
});

// Update exam pattern validation schema
const updateExamPatternSchema = z.object({
  programm_id: z.string().uuid('Programme ID must be a valid UUID').optional(),
  pattern_name: z
    .string()
    .min(1, 'Pattern name is required')
    .max(200, 'Pattern name must be less than 200 characters')
    .optional(),
  grading_type: z
    .enum(['absolute', 'relative', 'cgpa', 'percentage'], {
      message:
        'Grading type must be one of: absolute, relative, cgpa, percentage',
    })
    .optional(),
  grace_marks_allowed: z
    .number()
    .int('Grace marks allowed must be an integer')
    .min(0, 'Grace marks allowed cannot be negative')
    .optional(),
  grace_marks_max: z
    .number()
    .int('Grace marks max must be an integer')
    .min(0, 'Grace marks max cannot be negative')
    .optional(),
  atkt_rule: z.string().optional().nullable(),
  rounding_rule: z
    .string()
    .max(100, 'Rounding rule must be less than 100 characters')
    .optional()
    .nullable(),
  passing_criteria: z.string().optional().nullable(),
  detention_criteria: z.string().optional().nullable(),
  status: z.boolean().optional(),
});

// ID param validation for UUID
const examPatternIdParamSchema = z.object({
  pattern_id: z.string().uuid('Exam pattern ID must be a valid UUID'),
});

const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

module.exports = {
  createExamPatternSchema,
  updateExamPatternSchema,
  examPatternIdParamSchema,
  idParamSchema,
};
