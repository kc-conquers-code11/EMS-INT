const { z } = require('zod');

const dateOnlyString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

const hallTicketSettingsFieldsSchema = z.object({
  exam_event_id: z.string().uuid({ message: 'Invalid exam event ID' }),
  hall_ticket_status: z.enum(['enabled', 'disabled']),
  release_date: dateOnlyString,
  download_last_date: dateOnlyString,
  late_exam_required: z.enum(['yes', 'no']),
  instructions: z.array(z.string()).optional(),
});

const dateRangeRefine = (data) => {
  if (data.release_date && data.download_last_date) {
    return data.download_last_date >= data.release_date;
  }
  return true;
};

const hallTicketSettingsCreateSchema = hallTicketSettingsFieldsSchema.refine(dateRangeRefine, {
  message: 'download_last_date must be on or after release_date',
  path: ['download_last_date'],
});

const hallTicketSettingsUpdateSchema = hallTicketSettingsFieldsSchema
  .omit({ exam_event_id: true })
  .partial()
  .refine(dateRangeRefine, {
    message: 'download_last_date must be on or after release_date',
    path: ['download_last_date'],
  });

const examEventIdParamSchema = z.object({
  exam_event_id: z.string().uuid({ message: 'Invalid exam event ID' }),
});

const emptyToUndefined = (value) => (value === '' || value == null ? undefined : value);

const hallTicketGenerationControlQuerySchema = z.object({
  exam_event_id: z.preprocess(
    emptyToUndefined,
    z.string().uuid({ message: 'Invalid exam event ID' }).optional()
  ),
  eligibility_status: z.preprocess(
    emptyToUndefined,
    z.enum(['eligible', 'not-eligible', 'all']).optional()
  ),
  branch_id: z.preprocess(
    emptyToUndefined,
    z.string().uuid({ message: 'Invalid branch ID' }).optional()
  ),
  semester_id: z.preprocess(
    emptyToUndefined,
    z.string().uuid({ message: 'Invalid semester ID' }).optional()
  ),
});

const optionalStudentId = z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return String(val).trim();
  },
  z.string().min(1, { message: 'Invalid student ID' }).optional()
);

const hallTicketGenerateSchema = z.object({
  student_id: optionalStudentId,
  exam_event_id: z.string().uuid({ message: 'Invalid exam event ID' }),
  format: z.enum(['pdf', 'html']).optional().default('pdf'),
  include_principal_signature: z.boolean().optional().default(true),
});

const hallTicketBulkDownloadSchema = z.object({
  exam_event_id: z.string().uuid({ message: 'Invalid exam event ID' }),
  include_principal_signature: z.boolean().optional().default(true),
});

const boolFromQuery = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return true;
  if (val === false || val === 'false' || val === '0' || val === 0) return false;
  return true;
}, z.boolean());

const hallTicketDownloadQuerySchema = z.object({
  include_principal_signature: boolFromQuery.optional(),
});

const hallTicketHoldSchema = z.object({
  exam_reg_id: z.string().min(1, { message: 'Exam registration ID is required' }),
  on_hold: z.coerce.boolean(),
});

const hallTicketPublishSchema = z.object({
  exam_event_id: z.string().uuid({ message: 'Invalid exam event ID' }),
  scheduled_at: z.string().optional(),
});

const examEventIdQuerySchema = z.object({
  exam_event_id: z.preprocess(
    emptyToUndefined,
    z.string().uuid({ message: 'Invalid exam event ID' }).optional()
  ),
});

// Legacy schemas (existing download + global settings endpoints)
const hallTicketSettingsSchema = z.object({
  is_enabled: z.boolean({ required_error: 'is_enabled is required' }),
  enabled_by: z.string().uuid().optional(),
  instructions: z.array(z.string()).optional(),
});

const hallTicketParamSchema = z.object({
  studentId: z.string().min(1, { message: 'Student ID is required' }),
  eventId: z.string().uuid({ message: 'Invalid exam event ID format' }).optional(),
});

/** SQL NULL/empty → undefined so z.string().optional() accepts DB rows */
const nullishString = z.preprocess(
  (val) => (val == null || val === '' ? undefined : String(val)),
  z.string().optional()
);

const hallTicketDataSchema = z.object({
  sid: z.string().min(1, 'Student id is required'),
  stud_clg_id: nullishString,
  student_name: z.string().min(1),
  photo_url: z.string().nullish(),
  programme_name: nullishString,
  branch_code: nullishString,
  branch_name: nullishString,
  academic_year: nullishString,
  seat_no: nullishString,
  event_name: z.string().min(1),
  instructions: z.array(z.string()).optional(),
  include_principal_signature: z.boolean().optional(),
  principal_signature_src: z.string().nullable().optional(),
  principal_signature_mime: z.string().nullable().optional(),
  principal_signature_message: z.string().nullable().optional(),
  exam_schedule: z
    .array(
      z.object({
        subject_code: z.string().nullable().optional(),
        subject_name: z.string().nullable().optional(),
        exam_date: z.string().nullable().optional(),
        exam_time: z.string().nullable().optional(),
      })
    )
    .min(1),
});

module.exports = {
  hallTicketSettingsCreateSchema,
  hallTicketSettingsUpdateSchema,
  examEventIdParamSchema,
  hallTicketGenerationControlQuerySchema,
  hallTicketGenerateSchema,
  hallTicketBulkDownloadSchema,
  hallTicketDownloadQuerySchema,
  hallTicketHoldSchema,
  hallTicketPublishSchema,
  examEventIdQuerySchema,
  hallTicketSettingsSchema,
  hallTicketParamSchema,
  hallTicketDataSchema,
};
