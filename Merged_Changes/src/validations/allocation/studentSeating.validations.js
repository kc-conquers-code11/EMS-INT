const { z } = require('zod');

const createSeatingSchema = z.object({
  block_id: z.string().uuid(),
  exam_reg_id: z.string().uuid(),
  seat_no: z.string().min(1).max(20),
});

const updateSeatingSchema = createSeatingSchema.partial();

const seatingIdSchema = z.object({
  seating_id: z.string().uuid(),
});

const blockIdParamSchema = z.object({
  block_id: z.string().uuid(),
});

const seatingQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  block_id: z.string().uuid().optional(),
  exam_reg_id: z.string().uuid().optional(),
});

module.exports = {
  createSeatingSchema,
  updateSeatingSchema,
  seatingIdSchema,
  blockIdParamSchema,
  seatingQuerySchema,
};
