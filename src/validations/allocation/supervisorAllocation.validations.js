const { z } = require('zod');

const DUTY_STATUSES = ['assigned', 'accepted', 'rejected', 'completed'];

const createDutySchema = z.object({
  timetable_id: z.string().uuid().optional(),
  room_id: z.string().uuid().optional(),
  faculty_id: z.string().uuid(),
  duty_status: z.enum(DUTY_STATUSES).default('assigned'),
  remarks: z.string().max(1000).optional(),
});

const updateDutySchema = createDutySchema.partial();

const dutyIdSchema = z.object({
  duty_id: z.string().uuid(),
});

const rejectDutySchema = z.object({
  duty_id: z.string().uuid(),
  remarks: z.string().max(1000).optional(),
});

const dutyQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  faculty_id: z.string().uuid().optional(),
  duty_status: z.enum(DUTY_STATUSES).optional(),
  timetable_id: z.string().uuid().optional(),
});

module.exports = {
  DUTY_STATUSES,
  createDutySchema,
  updateDutySchema,
  dutyIdSchema,
  rejectDutySchema,
  dutyQuerySchema,
};
