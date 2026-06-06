// src/validations/exam/examEvents.validation.js
const { z } = require('zod');

// Create exam event validation schema
const createExamEventSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .min(1, 'Institution ID is required'),
  academic_id: z
    .string()
    // .uuid('Academic ID must be a valid UUID')
    .min(1, 'Academic ID is required'),
  semester_id: z
    .string()
    .uuid('Semester ID must be a valid UUID')
    .min(1, 'Semester ID is required'),
  event_name: z
    .string()
    .min(1, 'Event name is required')
    .max(255, 'Event name must be less than 255 characters'),
  exam_type: z
    .enum(['theory', 'practical', 'both', 'online', 'offline', 'exam_event'], {
      message:
        'Exam type must be one of: theory, practical, both, online, offline, exam_event',
    })
    .optional()
    .nullable(),
  reg_start: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Registration start date must be in YYYY-MM-DD format'
    )
    .optional()
    .nullable(),
  reg_end: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Registration end date must be in YYYY-MM-DD format'
    )
    .optional()
    .nullable(),
  fee_regular: z
    .number()
    .min(0, 'Regular fee cannot be negative')
    .optional()
    .default(0),
  fee_backlog: z
    .number()
    .min(0, 'Backlog fee cannot be negative')
    .optional()
    .default(0),
  pattern_id: z
    .string()
    .uuid('Pattern ID must be a valid UUID')
    .optional()
    .nullable(),
  is_published: z.boolean().default(false),
  status: z
    .enum(['draft', 'published', 'ongoing', 'completed', 'cancelled'], {
      message:
        'Status must be one of: draft, published, ongoing, completed, cancelled',
    })
    .default('draft'),
  created_by: z
    .string()
    .uuid('Created by must be a valid UUID')
    .optional()
    .nullable(),
});

// Update exam event validation schema
const updateExamEventSchema = z.object({
  institution_id: z
    .string()
    .uuid('Institution ID must be a valid UUID')
    .optional(),
  //   academic_id: z.string().uuid('Academic ID must be a valid UUID').optional(),
  semester_id: z.string().uuid('Semester ID must be a valid UUID').optional(),
  event_name: z
    .string()
    .min(1, 'Event name is required')
    .max(255, 'Event name must be less than 255 characters')
    .optional(),
  exam_type: z
    .enum(['theory', 'practical', 'both', 'online', 'offline', 'exam_event'])
    .optional()
    .nullable(),
  reg_start: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Registration start date must be in YYYY-MM-DD format'
    )
    .optional()
    .nullable(),
  reg_end: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Registration end date must be in YYYY-MM-DD format'
    )
    .optional()
    .nullable(),
  fee_regular: z.number().min(0, 'Regular fee cannot be negative').optional(),
  fee_backlog: z.number().min(0, 'Backlog fee cannot be negative').optional(),
  pattern_id: z
    .string()
    .uuid('Pattern ID must be a valid UUID')
    .optional()
    .nullable(),
  is_published: z.boolean().optional(),
  status: z
    .enum(['draft', 'published', 'ongoing', 'completed', 'cancelled'])
    .optional(),
  created_by: z
    .string()
    .uuid('Created by must be a valid UUID')
    .optional()
    .nullable(),
});

// ID param validation for UUID
const examEventIdParamSchema = z.object({
  event_id: z.string().uuid('Exam event ID must be a valid UUID'),
});

const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

const rescheduleExamEventSchema = z.object({
  reschedule_reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters long')
    .max(500, 'Reason must be at most 500 characters long'),
  updated_dates: z
    .array(z.string().datetime('Must be a valid ISO 8601 datetime string'))
    .min(1, 'At least one updated date slot must be provided'),
});

module.exports = {
  createExamEventSchema,
  updateExamEventSchema,
  examEventIdParamSchema,
  idParamSchema,
  rescheduleExamEventSchema,
};
