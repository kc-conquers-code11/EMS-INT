const { z } = require('zod');

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Time validation regex (HH:MM:SS or HH:MM)
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

// Create time slot validation schema
const createTimeSlotSchema = z
  .object({
    event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID').optional().nullable(),
    semester_id: z.string().regex(uuidRegex, 'Semester ID must be a valid UUID').optional().nullable(),
    slot_label: z
      .string()
      .min(1, 'Slot label is required')
      .max(50, 'Slot label cannot exceed 50 characters'),
    start_time: z
      .string()
      .regex(timeRegex, 'Start time must be in HH:MM:SS format'),
    end_time: z
      .string()
      .regex(timeRegex, 'End time must be in HH:MM:SS format'),
  })
  .refine(
    (data) => {
      // Validate that end_time is after start_time
      const start = data.start_time;
      const end = data.end_time;
      return start < end;
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  );

// Bulk create time slots schema
const bulkCreateTimeSlotSchema = z.object({
  event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID'),
  slots: z
    .array(
      z.object({
        semester_id: z.string().regex(uuidRegex, 'Semester ID must be a valid UUID').optional().nullable(),
        slot_label: z
          .string()
          .min(1, 'Slot label is required')
          .max(50, 'Slot label cannot exceed 50 characters'),
        start_time: z
          .string()
          .regex(timeRegex, 'Start time must be in HH:MM:SS format'),
        end_time: z
          .string()
          .regex(timeRegex, 'End time must be in HH:MM:SS format'),
      })
    )
    .min(1, 'At least one time slot is required'),
});

// Update time slot validation schema
const updateTimeSlotSchema = z
  .object({
    semester_id: z.string().regex(uuidRegex, 'Semester ID must be a valid UUID').optional().nullable(),
    slot_label: z
      .string()
      .min(1, 'Slot label is required')
      .max(50, 'Slot label cannot exceed 50 characters')
      .optional(),
    start_time: z
      .string()
      .regex(timeRegex, 'Start time must be in HH:MM:SS format')
      .optional(),
    end_time: z
      .string()
      .regex(timeRegex, 'End time must be in HH:MM:SS format')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        return data.start_time < data.end_time;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  );

// Slot ID param validation
const slotIdParamSchema = z.object({
  slot_id: z.string().regex(uuidRegex, 'Slot ID must be a valid UUID'),
});

// Get slots by event schema
const getSlotsByEventSchema = z.object({
  event_id: z.string().regex(uuidRegex, 'Event ID must be a valid UUID'),
});

module.exports = {
  createTimeSlotSchema,
  bulkCreateTimeSlotSchema,
  updateTimeSlotSchema,
  slotIdParamSchema,
  getSlotsByEventSchema,
};
