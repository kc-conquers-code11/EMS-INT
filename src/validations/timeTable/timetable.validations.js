const { z } = require('zod');

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validShifts = ['MORNING', 'AFTERNOON', 'EVENING'];
const validStatuses = ['scheduled', 'rescheduled', 'cancelled', 'completed'];

// Create timetable entry validation schema
const createTimetableSchema = z
  .object({
    event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID'),
    mapping_id: z.string().regex(uuidRegex, 'Mapping ID must be a valid UUID'),
    exam_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Exam date must be in YYYY-MM-DD format'),
    slot_id: z.string().regex(uuidRegex, 'Slot ID must be a valid UUID'),
    shift: z.enum(validShifts).default('MORNING'),
    venue: z
      .string()
      .max(255, 'Venue cannot exceed 255 characters')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validate that exam date is not in the past (can be adjusted as needed)
      const examDate = new Date(data.exam_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return examDate >= today;
    },
    {
      message: 'Exam date cannot be in the past',
      path: ['exam_date'],
    }
  );

// Bulk create timetable schema
const bulkCreateTimetableSchema = z.object({
  entries: z
    .array(createTimetableSchema)
    .min(1, 'At least one timetable entry is required'),
});

// Update timetable validation schema
const updateTimetableSchema = z.object({
  exam_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Exam date must be in YYYY-MM-DD format')
    .optional(),
  slot_id: z
    .string()
    .regex(uuidRegex, 'Slot ID must be a valid UUID')
    .optional(),
  shift: z.enum(validShifts).optional(),
  venue: z
    .string()
    .max(255, 'Venue cannot exceed 255 characters')
    .optional()
    .nullable(),
  status: z.enum(validStatuses).optional(),
  reschedule_reason: z
    .string()
    .max(500, 'Reschedule reason cannot exceed 500 characters')
    .optional()
    .nullable(),
});

// Reschedule timetable validation schema
const rescheduleTimetableSchema = z.object({
  new_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'New exam date must be in YYYY-MM-DD format'),
  new_slot_id: z.string().regex(uuidRegex, 'New slot ID must be a valid UUID'),
  reason: z
    .string()
    .min(1, 'Reschedule reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),
});

// Timetable ID param validation
const timetableIdParamSchema = z.object({
  timetable_id: z
    .string()
    .regex(uuidRegex, 'Timetable ID must be a valid UUID'),
});

// Get timetable by event schema
const getTimetableByEventSchema = z.object({
  event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID'),
});

// Get timetable by date range schema
const getTimetableByDateRangeSchema = z.object({
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
});

// Publish timetable schema
const publishTimetableSchema = z.object({
  event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID'),
  is_published: z.boolean().default(true),
});

module.exports = {
  createTimetableSchema,
  bulkCreateTimetableSchema,
  updateTimetableSchema,
  rescheduleTimetableSchema,
  timetableIdParamSchema,
  getTimetableByEventSchema,
  getTimetableByDateRangeSchema,
  publishTimetableSchema,
};
