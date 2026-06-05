const { z } = require('zod');

const uuid = z.string().uuid();

const mappingIdParamSchema = z.object({
  id: uuid,
});

const listQuerySchema = z.object({
  q: z.string().optional(),
  semester_id: uuid.optional(),
  faculty_id: uuid.optional(),
  subject_id: uuid.optional(),
  status: z.enum(['all', 'mapped', 'unmapped']).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

const assignmentItemSchema = z.object({
  subject_id: uuid,
  semester_id: uuid,
});

const upsertFacultyMappingSchema = z.object({
  faculty_id: uuid,
  faculty_role: z.string().max(50).optional().nullable().default('Primary'),
  assignments: z.array(assignmentItemSchema).default([]),
});

const facultyIdParamSchema = z.object({
  faculty_id: z.string().uuid(),
});

const createMappingSchema = z.object({
  subject_id: uuid,
  semester_id: uuid,
  faculty_ids: z.array(uuid).min(1, 'At least one faculty member is required').max(1, 'Only one faculty per subject per semester'),
  faculty_role: z.string().max(50).optional().nullable(),
});

const updateMappingSchema = z.object({
  semester_id: uuid,
  faculty_ids: z.array(uuid).min(1, 'At least one faculty member is required').max(1, 'Only one faculty per subject per semester'),
  faculty_role: z.string().max(50).optional().nullable(),
});

const subjectsLookupQuerySchema = z.object({
  semester_id: uuid.optional(),
});

module.exports = {
  mappingIdParamSchema,
  listQuerySchema,
  createMappingSchema,
  updateMappingSchema,
  subjectsLookupQuerySchema,
  upsertFacultyMappingSchema,
  facultyIdParamSchema,
};
