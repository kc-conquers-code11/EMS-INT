const { z } = require('zod');

const rescheduleExamEventSchema = z.object({
  reschedule_reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters long')
    .max(500, 'Reason must be at most 500 characters long'),
  updated_dates: z
    .array(z.string().datetime('Must be a valid ISO 8601 datetime string'))
    .min(1, 'At least one updated date slot must be provided'),
});

const examEventIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: 'Exam Event ID must be a valid integer' }),
});

module.exports = {
  rescheduleExamEventSchema,
  examEventIdParamSchema,
};
