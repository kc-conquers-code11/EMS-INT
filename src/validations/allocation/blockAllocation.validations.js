const { z } = require('zod');

const createBlockSchema = z.object({
  timetable_id: z.string().uuid().optional(),
  room_id: z.string().uuid().optional(),
  block_no: z.string().min(1).max(20),
  allocated_capacity: z.number().int().positive(),
});

const updateBlockSchema = createBlockSchema.partial();

const blockIdSchema = z.object({
  block_id: z.string().uuid(),
});

const blockQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  timetable_id: z.string().uuid().optional(),
  room_id: z.string().uuid().optional(),
});

module.exports = {
  createBlockSchema,
  updateBlockSchema,
  blockIdSchema,
  blockQuerySchema,
};
