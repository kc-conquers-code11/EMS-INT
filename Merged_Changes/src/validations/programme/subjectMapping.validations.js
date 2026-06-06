const { z } = require('zod');

// UUID validation regex
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Create subject mapping validation schema
const createSubjectMappingSchema = z.object({
  semester_id: z.string().regex(uuidRegex, 'Semester ID must be a valid UUID'),
  // branch_id: z.string().regex(uuidRegex, 'Branch ID must be a valid UUID'),
  subject_id: z.string().regex(uuidRegex, 'Subject ID must be a valid UUID'),
  exam_event_id: z
    .string()
    .regex(uuidRegex, 'Exam event ID must be a valid UUID')
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
});

// Bulk create subject mapping schema
const bulkCreateSubjectMappingSchema = z.object({
  mappings: z
    .array(createSubjectMappingSchema)
    .min(1, 'At least one mapping is required'),
});

// Update subject mapping schema
const updateSubjectMappingSchema = z.object({
  semester_id: z
    .string()
    .regex(uuidRegex, 'Semester ID must be a valid UUID')
    .optional(),
  branch_id: z
    .string()
    .regex(uuidRegex, 'Branch ID must be a valid UUID')
    .optional(),
  subject_id: z
    .string()
    .regex(uuidRegex, 'Subject ID must be a valid UUID')
    .optional(),
  exam_event_id: z
    .string()
    .regex(uuidRegex, 'Exam event ID must be a valid UUID')
    .optional()
    .nullable(),
  is_active: z.boolean().optional(),
});

// ID param validation
const mappingIdParamSchema = z.object({
  mapping_id: z.string().regex(uuidRegex, 'Mapping ID must be a valid UUID'),
});

const idParamSchema = z.object({
  id: z.string().regex(uuidRegex, 'ID must be a valid UUID'),
});

// Get mappings by semester and branch
const getMappingsBySemesterBranchSchema = z.object({
  semester_id: z.string().regex(uuidRegex, 'Semester ID must be a valid UUID'),
  branch_id: z.string().regex(uuidRegex, 'Branch ID must be a valid UUID'),
});

module.exports = {
  createSubjectMappingSchema,
  bulkCreateSubjectMappingSchema,
  updateSubjectMappingSchema,
  mappingIdParamSchema,
  idParamSchema,
  getMappingsBySemesterBranchSchema,
};
