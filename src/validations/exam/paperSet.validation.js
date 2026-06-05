const { z } = require('zod');
const { PAPER_STATUS } = require('../../constants/paperSet.constants.js');

const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

const requestPaperSetSchema = z.object({
  event_id: uuidSchema,
  subject_id: uuidSchema,
  faculty_id: uuidSchema,
  academic_id: uuidSchema.optional().nullable(),
  semester_id: uuidSchema.optional().nullable(),
  exam_type: z.string().min(1).max(50).optional().nullable(),
  set_name: z.string().min(1, 'Set name is required').max(150),
  instructions: z.string().max(2000).optional().nullable(),
  submission_deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
    .optional()
    .nullable(),
});

const setIdParamSchema = z.object({
  set_id: uuidSchema,
});

const finalLockBodySchema = z.object({
  remarks: z.string().max(500).optional(),
});

const listPaperSetsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  paper_status: z
    .enum([
      PAPER_STATUS.REQUESTED,
      PAPER_STATUS.ACCEPTED,
      PAPER_STATUS.DRAFT,
      PAPER_STATUS.SUBMITTED_TO_COE,
      PAPER_STATUS.FINAL_LOCKED,
    ])
    .optional(),
  faculty_id: uuidSchema.optional(),
  subject_id: uuidSchema.optional(),
  event_id: uuidSchema.optional(),
  academic_id: uuidSchema.optional(),
  semester_id: uuidSchema.optional(),
});

module.exports = {
  requestPaperSetSchema,
  setIdParamSchema,
  finalLockBodySchema,
  listPaperSetsSchema,
};
