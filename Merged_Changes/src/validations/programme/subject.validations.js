const z = require('zod');

const subjectIdParamSchema = z.object({
  subject_id: z.string().uuid(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const SUBJECT_TYPE_CODES = ['TH', 'PR', 'OR', 'TW'];
const SUBJECT_TYPE_LABELS = ['Theory', 'Practical', 'Theory+Practical', 'Project', 'Elective'];

const normalizeSubjectType = (value) => {
  if (value == null || value === '') return undefined;

  const parts = Array.isArray(value)
    ? value
    : String(value).split(/[,|/+]+/);

  const codes = [];
  const labelMap = {
    TH: 'TH',
    PR: 'PR',
    OR: 'OR',
    TW: 'TW',
    THEORY: 'TH',
    PRACTICAL: 'PR',
    ORAL: 'OR',
    'TERM WORK': 'TW',
    'THEORY+PRACTICAL': 'TH',
    PROJECT: 'TW',
    ELECTIVE: 'TH',
  };

  for (const part of parts) {
    const token = String(part).trim().toUpperCase();
    if (!token) continue;
    const code = labelMap[token] || (SUBJECT_TYPE_CODES.includes(token) ? token : null);
    if (code && !codes.includes(code)) {
      codes.push(code);
    }
  }

  return codes.length > 0 ? codes.join(',') : undefined;
};

const subjectTypeSchema = z.preprocess(
  normalizeSubjectType,
  z.string().max(100).optional()
);

const createSubjectSchema = z.object({
  scheme_id: z.string().uuid(),
  subject_code: z.string().max(50).optional(),
  subject_name: z.string().min(1).max(255),
  subject_type: subjectTypeSchema,
  credits: z.number().int().min(0).max(30).optional(),
  max_theory: z.number().int().min(0).default(0),
  max_practical: z.number().int().min(0).default(0),
  max_oral: z.number().int().min(0).default(0),
  max_tw: z.number().int().min(0).default(0),
  min_pass_theory: z.number().int().min(0).default(0),
  min_pass_practical: z.number().int().min(0).default(0),
  exam_duration_min: z.number().int().min(0).max(360).optional(),
  status: z.boolean().default(true),
  branch_id: z.string().uuid().nullable().optional(),
  institution_id: z.string().uuid().nullable().optional(),
  depart_id: z.string().uuid().nullable().optional(),
  academic_id: z.string().uuid().nullable().optional(),
  sem: z.number().int().min(1).max(12).nullable().optional(),
  acad_year: z.string().max(50).optional(),
});

const updateSubjectSchema = createSubjectSchema.partial();

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
  idParamSchema,
  normalizeSubjectType,
};
