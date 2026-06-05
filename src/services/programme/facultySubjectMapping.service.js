const crypto = require('crypto');
const db = require('../../../models');
const { SCOPE_LEVEL } = require('../../constants/roles.js');
const {
  assertDepartmentAccess,
  assertInstitutionAccess,
} = require('../../helpers/scope.helper.js');

const throwErr = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const isFacultyRole = (user) =>
  String(user?.role || '').trim().toLowerCase() === 'faculty';

const isHodRole = (user) => String(user?.role || '').trim().toLowerCase() === 'hod';

/** Resolve department via subject.depart_id or branch.depart_id */
const SUBJECT_DEPT_JOIN = `
  LEFT JOIN branch b ON s.branch_id = b.branch_id AND b.deletedAt IS NULL
  LEFT JOIN department d ON d.depart_id = COALESCE(s.depart_id, b.depart_id)
`;

const buildScopeFilters = (scope, user) => {
  const replacements = {};
  const clauses = ['s.deletedAt IS NULL'];

  if (scope?.unrestricted) {
    return { clauses, replacements };
  }

  if (isFacultyRole(user) && scope?.faculty_id) {
    clauses.push(`EXISTS (
      SELECT 1 FROM faculty_subject_mapping fsm_self
      WHERE fsm_self.subject_id = s.subject_id
        AND fsm_self.faculty_id = :scopeFacultyId
        AND fsm_self.deletedAt IS NULL
    )`);
    replacements.scopeFacultyId = scope.faculty_id;
    return { clauses, replacements };
  }

  if (scope?.institution_id) {
    clauses.push(
      'COALESCE(s.institution_id, d.institution_id) = :scopeInstitutionId'
    );
    replacements.scopeInstitutionId = scope.institution_id;
  }

  if (scope?.level === SCOPE_LEVEL.DEPARTMENT && scope?.depart_id) {
    clauses.push(`(
      COALESCE(s.depart_id, d.depart_id) = :scopeDepartId
      OR EXISTS (
        SELECT 1 FROM semester_subject_mapping scope_ssm
        JOIN branch scope_b ON scope_b.branch_id = scope_ssm.branch_id
        WHERE scope_ssm.subject_id = s.subject_id
          AND scope_b.depart_id = :scopeDepartId
          AND scope_ssm.deletedAt IS NULL
          AND scope_b.deletedAt IS NULL
          AND scope_ssm.is_active = 1
      )
    )`);
    replacements.scopeDepartId = scope.depart_id;
  }

  return { clauses, replacements };
};

async function getSubjectDepartment(subjectId) {
  const [row] = await db.sequelize.query(
    `SELECT s.subject_id, s.subject_name, s.branch_id,
            COALESCE(s.depart_id, b.depart_id) AS depart_id,
            COALESCE(s.institution_id, d.institution_id) AS institution_id,
            d.depart_name
     FROM subject s
     ${SUBJECT_DEPT_JOIN}
     WHERE s.subject_id = :subjectId AND s.deletedAt IS NULL
     LIMIT 1`,
    {
      replacements: { subjectId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return row || null;
}

async function assertSubjectInScope(scope, user, subjectId) {
  const subject = await getSubjectDepartment(subjectId);
  if (!subject) throwErr('Subject not found', 404);
  if (!subject.depart_id) {
    throwErr('Subject is not linked to a department branch', 400);
  }
  assertInstitutionAccess(scope, subject.institution_id);
  assertDepartmentAccess(scope, subject.depart_id);
  if (isFacultyRole(user)) {
    throwErr('Faculty cannot modify subject-faculty mappings', 403);
  }
  if (isHodRole(user) && scope?.depart_id && scope.depart_id !== subject.depart_id) {
    throwErr('Access denied: subject outside your department', 403);
  }
  return subject;
}

async function assertFacultyInScope(scope, user, facultyId) {
  const [faculty] = await db.sequelize.query(
    `SELECT f.faculty_id, f.depart_id, f.name, d.institution_id
     FROM faculty f
     JOIN department d ON d.depart_id = f.depart_id
     WHERE f.faculty_id = :facultyId
       AND f.deletedAt IS NULL
       AND (f.status = 1 OR f.status IS NULL)
     LIMIT 1`,
    {
      replacements: { facultyId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!faculty) throwErr('Faculty not found', 404);
  assertInstitutionAccess(scope, faculty.institution_id);
  assertDepartmentAccess(scope, faculty.depart_id);
  if (isHodRole(user) && scope?.depart_id && scope.depart_id !== faculty.depart_id) {
    throwErr('Access denied: faculty outside your department', 403);
  }
  return faculty;
}

const getActiveMappingForSubjectSemester = async (subjectId, semesterId) => {
  const [row] = await db.sequelize.query(
    `SELECT fsm.id, fsm.faculty_id, f.name AS faculty_name
     FROM faculty_subject_mapping fsm
     JOIN faculty f ON f.faculty_id = fsm.faculty_id AND f.deletedAt IS NULL
     WHERE fsm.subject_id = :subjectId
       AND fsm.semester_id = :semesterId
       AND fsm.deletedAt IS NULL
     LIMIT 1`,
    {
      replacements: { subjectId, semesterId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return row || null;
};

const buildConflictMessage = (subjectName, semesterNumber, facultyName) =>
  `${subjectName} (Semester ${semesterNumber}) is already assigned to ${facultyName}. Please remove the existing mapping before assigning another faculty.`;

async function assertSemesterInScope(scope, user, semesterId) {
  const semesters = await listDepartmentSemesters(scope, user);
  if (!semesters.some((s) => s.semester_id === semesterId)) {
    throwErr('Semester not found or outside your department', 404);
  }
}

const buildMappingListScope = (scope, user) => {
  const replacements = {};
  const clauses = [
    'fsm.deletedAt IS NULL',
    'f.deletedAt IS NULL',
    's.deletedAt IS NULL',
  ];

  if (isFacultyRole(user) && scope?.faculty_id) {
    clauses.push('fsm.faculty_id = :scopeFacultyId');
    replacements.scopeFacultyId = scope.faculty_id;
    return { clauses, replacements };
  }

  if (scope?.level === SCOPE_LEVEL.DEPARTMENT && scope?.depart_id) {
    clauses.push(`(
      COALESCE(s.depart_id, b.depart_id) = :scopeDepartId
      OR EXISTS (
        SELECT 1 FROM semester_subject_mapping scope_ssm
        JOIN branch scope_b ON scope_b.branch_id = scope_ssm.branch_id
        WHERE scope_ssm.subject_id = s.subject_id
          AND scope_b.depart_id = :scopeDepartId
          AND scope_ssm.deletedAt IS NULL
          AND scope_b.deletedAt IS NULL
          AND scope_ssm.is_active = 1
      )
    )`);
    replacements.scopeDepartId = scope.depart_id;
  } else if (!scope?.unrestricted && scope?.institution_id) {
    clauses.push('COALESCE(s.institution_id, d.institution_id) = :scopeInstitutionId');
    replacements.scopeInstitutionId = scope.institution_id;
  }

  return { clauses, replacements };
};

const listMappings = async (scope, user, query = {}) => {
  const { clauses, replacements } = buildMappingListScope(scope, user);
  const search = query.q ? `%${query.q.trim()}%` : null;
  const page = query.page || 1;
  const limit = query.limit || 20;
  const offset = (page - 1) * limit;

  if (query.semester_id) {
    clauses.push('fsm.semester_id = :semesterId');
    replacements.semesterId = query.semester_id;
  }

  if (query.faculty_id) {
    clauses.push('fsm.faculty_id = :facultyId');
    replacements.facultyId = query.faculty_id;
  }

  if (query.subject_id) {
    clauses.push('fsm.subject_id = :subjectId');
    replacements.subjectId = query.subject_id;
  }

  if (search) {
    clauses.push(`(
      f.name LIKE :search OR s.subject_name LIKE :search OR s.subject_code LIKE :search
    )`);
    replacements.search = search;
  }

  const whereSQL = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const rows = await db.sequelize.query(
    `SELECT
      fsm.id AS mapping_id,
      f.faculty_id,
      f.name AS faculty_name,
      f.college_email AS faculty_email,
      sem.semester_id,
      sem.semester_number,
      CONCAT('Sem ', sem.semester_number, ' - ', sem.term_type) AS semester_label,
      s.subject_id,
      s.subject_name,
      s.subject_code,
      fsm.faculty_role,
      'Active' AS status
     FROM faculty_subject_mapping fsm
     JOIN faculty f ON f.faculty_id = fsm.faculty_id
     JOIN subject s ON s.subject_id = fsm.subject_id
     ${SUBJECT_DEPT_JOIN}
     JOIN semester sem ON sem.semester_id = fsm.semester_id AND sem.deleted_at IS NULL
     ${whereSQL}
     ORDER BY f.name ASC, sem.semester_number ASC, s.subject_name ASC
     LIMIT :limit OFFSET :offset`,
    {
      replacements: { ...replacements, limit, offset },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const [countRow] = await db.sequelize.query(
    `SELECT COUNT(*) AS total
     FROM faculty_subject_mapping fsm
     JOIN faculty f ON f.faculty_id = fsm.faculty_id
     JOIN subject s ON s.subject_id = fsm.subject_id
     ${SUBJECT_DEPT_JOIN}
     JOIN semester sem ON sem.semester_id = fsm.semester_id AND sem.deleted_at IS NULL
     ${whereSQL}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: parseInt(countRow?.total || 0, 10),
    },
  };
};

const getMappingDetailBySubject = async (scope, user, subjectId, semesterId) => {
  await assertSubjectInScope(scope, user, subjectId);

  const [subject] = await db.sequelize.query(
    `SELECT s.subject_id, s.subject_name, s.subject_code, s.status,
            d.depart_id, d.depart_name
     FROM subject s
     ${SUBJECT_DEPT_JOIN}
     WHERE s.subject_id = :subjectId AND s.deletedAt IS NULL`,
    {
      replacements: { subjectId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const mappingWhere = semesterId
    ? 'AND fsm.semester_id = :semesterId'
    : '';
  const replacements = { subjectId };
  if (semesterId) replacements.semesterId = semesterId;

  const mappings = await db.sequelize.query(
    `SELECT fsm.id, fsm.faculty_id, fsm.subject_id, fsm.semester_id,
            fsm.faculty_role, f.name AS faculty_name, f.college_email,
            CONCAT('Sem ', sem.semester_number, ' - ', sem.term_type) AS semester_label
     FROM faculty_subject_mapping fsm
     JOIN faculty f ON f.faculty_id = fsm.faculty_id AND f.deletedAt IS NULL
     LEFT JOIN semester sem ON sem.semester_id = fsm.semester_id
     WHERE fsm.subject_id = :subjectId AND fsm.deletedAt IS NULL
     ${mappingWhere}
     ORDER BY f.name ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return { subject, mappings };
};

const listDepartmentFaculty = async (scope, user) => {
  if (isFacultyRole(user)) {
    throwErr('Access denied', 403);
  }

  const departId = scope?.depart_id;
  if (!scope?.unrestricted && !departId && scope?.level === SCOPE_LEVEL.DEPARTMENT) {
    throwErr('Access denied: no department assigned', 403);
  }

  const replacements = {};
  const clauses = [
    'f.deletedAt IS NULL',
    '(f.status = 1 OR f.status = TRUE OR f.status IS NULL)',
  ];

  if (departId) {
    clauses.push('f.depart_id = :departId');
    replacements.departId = departId;
  } else if (scope?.institution_id) {
    clauses.push('d.institution_id = :institutionId');
    replacements.institutionId = scope.institution_id;
  }

  return db.sequelize.query(
    `SELECT f.faculty_id, f.name, f.college_email, f.email, f.depart_id, d.depart_name
     FROM faculty f
     JOIN department d ON d.depart_id = f.depart_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY f.name ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
};

const listDepartmentSemesters = async (scope, user) => {
  if (isFacultyRole(user)) {
    throwErr('Access denied', 403);
  }

  const replacements = {};
  const clauses = ['s.deleted_at IS NULL'];

  if (!scope?.unrestricted && scope?.institution_id) {
    clauses.push('COALESCE(p.institution_id, d.institution_id) = :scopeInstitutionId');
    replacements.scopeInstitutionId = scope.institution_id;
  }

  if (scope?.level === SCOPE_LEVEL.DEPARTMENT && scope?.depart_id) {
    clauses.push(`(
      b.depart_id = :scopeDepartId
      OR p.depart_id = :scopeDepartId
    )`);
    replacements.scopeDepartId = scope.depart_id;
  }

  return db.sequelize.query(
    `SELECT DISTINCT
      s.semester_id,
      s.semester_number,
      s.term_type,
      s.programme_id,
      p.programme_name,
      b.branch_name,
      CONCAT('Sem ', s.semester_number, ' - ', s.term_type) AS label
     FROM semester s
     LEFT JOIN programme p ON p.programm_id = s.programme_id AND p.deletedAt IS NULL
     LEFT JOIN branch b ON b.branch_id = s.branch_id AND b.deletedAt IS NULL
     LEFT JOIN department d ON d.depart_id = COALESCE(p.depart_id, b.depart_id)
     WHERE ${clauses.join(' AND ')}
     ORDER BY s.semester_number ASC, s.term_type ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
};

const listDepartmentSubjects = async (scope, user, semesterId) => {
  if (isFacultyRole(user)) {
    throwErr('Access denied', 403);
  }

  const { clauses, replacements } = buildScopeFilters(scope, user);

  if (semesterId) {
    clauses.push(`(
      EXISTS (
        SELECT 1 FROM semester_subject_mapping ssm
        INNER JOIN branch ssm_b ON ssm_b.branch_id = ssm.branch_id AND ssm_b.deletedAt IS NULL
        WHERE ssm.subject_id = s.subject_id
          AND ssm.semester_id = :semesterId
          AND ssm.deletedAt IS NULL
          AND (ssm.is_active = 1 OR ssm.is_active IS TRUE)
      )
      OR EXISTS (
        SELECT 1 FROM semester sem
        WHERE sem.semester_id = :semesterId
          AND sem.deleted_at IS NULL
          AND s.sem = sem.semester_number
      )
    )`);
    replacements.semesterId = semesterId;
  }

  return db.sequelize.query(
    `SELECT s.subject_id, s.subject_name, s.subject_code, s.branch_id,
            d.depart_id, d.depart_name
     FROM subject s
     ${SUBJECT_DEPT_JOIN}
     WHERE ${clauses.join(' AND ')}
     ORDER BY s.subject_name ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
};

const getFacultyAllocationPanel = async (scope, user, facultyId) => {
  const faculty = await assertFacultyInScope(scope, user, facultyId);
  const semesters = await listDepartmentSemesters(scope, user);
  const semesterGroups = [];

  for (const sem of semesters) {
    const subjects = await listDepartmentSubjects(scope, user, sem.semester_id);
    if (!subjects.length) continue;

    const subjectIds = subjects.map((s) => s.subject_id);
    const mappingRows = await db.sequelize.query(
      `SELECT fsm.id AS mapping_id, fsm.subject_id, fsm.faculty_id, f.name AS assigned_faculty_name
       FROM faculty_subject_mapping fsm
       JOIN faculty f ON f.faculty_id = fsm.faculty_id AND f.deletedAt IS NULL
       WHERE fsm.semester_id = :semesterId
         AND fsm.subject_id IN (:subjectIds)
         AND fsm.deletedAt IS NULL`,
      {
        replacements: { semesterId: sem.semester_id, subjectIds },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const mappingBySubject = new Map(mappingRows.map((r) => [r.subject_id, r]));

    semesterGroups.push({
      semester_id: sem.semester_id,
      semester_number: sem.semester_number,
      label: sem.label,
      subjects: subjects.map((s) => {
        const existing = mappingBySubject.get(s.subject_id);
        const assignedToSelf = existing?.faculty_id === facultyId;
        const assignedToOther = existing && existing.faculty_id !== facultyId;
        return {
          subject_id: s.subject_id,
          subject_name: s.subject_name,
          subject_code: s.subject_code,
          mapping_id: assignedToSelf ? existing.mapping_id : null,
          assigned_faculty_id: existing?.faculty_id || null,
          assigned_faculty_name: existing?.assigned_faculty_name || null,
          is_assigned_to_self: assignedToSelf,
          is_blocked: assignedToOther,
        };
      }),
    });
  }

  return {
    faculty_id: faculty.faculty_id,
    faculty_name: faculty.name,
    semesters: semesterGroups,
  };
};

const upsertMappingsForFaculty = async (scope, user, payload) => {
  const { faculty_id: facultyId, faculty_role: facultyRole, assignments } = payload;

  await assertFacultyInScope(scope, user, facultyId);

  const normalizedAssignments = [];
  const seen = new Set();
  for (const item of assignments || []) {
    const key = `${item.subject_id}:${item.semester_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await assertSubjectInScope(scope, user, item.subject_id);
    await assertSemesterInScope(scope, user, item.semester_id);
    normalizedAssignments.push(item);
  }

  for (const item of normalizedAssignments) {
    const existing = await getActiveMappingForSubjectSemester(item.subject_id, item.semester_id);
    if (existing && existing.faculty_id !== facultyId) {
      const [subjectRow] = await db.sequelize.query(
        `SELECT subject_name FROM subject WHERE subject_id = :subjectId LIMIT 1`,
        {
          replacements: { subjectId: item.subject_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );
      const [semRow] = await db.sequelize.query(
        `SELECT semester_number FROM semester WHERE semester_id = :semesterId LIMIT 1`,
        {
          replacements: { semesterId: item.semester_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );
      throwErr(
        buildConflictMessage(
          subjectRow?.subject_name || 'Subject',
          semRow?.semester_number ?? '',
          existing.faculty_name
        ),
        409
      );
    }
  }

  const currentRows = await db.sequelize.query(
    `SELECT id, subject_id, semester_id
     FROM faculty_subject_mapping
     WHERE faculty_id = :facultyId AND deletedAt IS NULL`,
    {
      replacements: { facultyId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const desiredKeys = new Set(
    normalizedAssignments.map((a) => `${a.subject_id}:${a.semester_id}`)
  );
  const currentKeys = new Map(
    currentRows.map((r) => [`${r.subject_id}:${r.semester_id}`, r.id])
  );

  const toRemove = currentRows.filter(
    (r) => !desiredKeys.has(`${r.subject_id}:${r.semester_id}`)
  );
  const toAdd = normalizedAssignments.filter(
    (a) => !currentKeys.has(`${a.subject_id}:${a.semester_id}`)
  );

  await db.sequelize.transaction(async (transaction) => {
    for (const row of toRemove) {
      await db.sequelize.query(
        `UPDATE faculty_subject_mapping SET deletedAt = NOW(), updatedAt = NOW()
         WHERE id = :id AND deletedAt IS NULL`,
        {
          replacements: { id: row.id },
          type: db.Sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );
    }

    for (const item of toAdd) {
      await db.sequelize.query(
        `INSERT INTO faculty_subject_mapping
         (id, faculty_id, subject_id, semester_id, faculty_role, createdAt, updatedAt)
         VALUES (:id, :facultyId, :subjectId, :semesterId, :facultyRole, NOW(), NOW())`,
        {
          replacements: {
            id: crypto.randomUUID(),
            facultyId,
            subjectId: item.subject_id,
            semesterId: item.semester_id,
            facultyRole: facultyRole || 'Primary',
          },
          type: db.Sequelize.QueryTypes.INSERT,
          transaction,
        }
      );
    }
  });

  return getFacultyAllocationPanel(scope, user, facultyId);
};

const upsertMappingsForSubject = async (
  scope,
  user,
  { subject_id, semester_id, faculty_ids, faculty_role },
  mappedBy
) => {
  const subject = await assertSubjectInScope(scope, user, subject_id);

  const uniqueFacultyIds = [...new Set(faculty_ids || [])];
  if (uniqueFacultyIds.length > 1) {
    throwErr('Only one primary faculty can be assigned per subject in a semester', 400);
  }

  for (const facultyId of uniqueFacultyIds) {
    const faculty = await assertFacultyInScope(scope, user, facultyId);
    if (faculty.depart_id !== subject.depart_id) {
      throwErr('Faculty must belong to the same department as the subject', 400);
    }
  }

  await assertSemesterInScope(scope, user, semester_id);

  if (uniqueFacultyIds.length === 1) {
    const existing = await getActiveMappingForSubjectSemester(subject_id, semester_id);
    if (existing && existing.faculty_id !== uniqueFacultyIds[0]) {
      const [semRow] = await db.sequelize.query(
        `SELECT semester_number FROM semester WHERE semester_id = :semesterId LIMIT 1`,
        {
          replacements: { semesterId: semester_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );
      throwErr(
        buildConflictMessage(
          subject.subject_name || 'Subject',
          semRow?.semester_number ?? '',
          existing.faculty_name
        ),
        409
      );
    }
  }

  const currentRows = await db.sequelize.query(
    `SELECT id, faculty_id
     FROM faculty_subject_mapping
     WHERE subject_id = :subjectId AND semester_id = :semesterId AND deletedAt IS NULL`,
    {
      replacements: { subjectId: subject_id, semesterId: semester_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const desiredSet = new Set(uniqueFacultyIds);
  const toRemove = currentRows.filter((r) => !desiredSet.has(r.faculty_id));
  const currentSet = new Set(currentRows.map((r) => r.faculty_id));
  const toAdd = uniqueFacultyIds.filter((id) => !currentSet.has(id));

  await db.sequelize.transaction(async (transaction) => {
    for (const row of toRemove) {
      await db.sequelize.query(
        `UPDATE faculty_subject_mapping SET deletedAt = NOW(), updatedAt = NOW()
         WHERE id = :id AND deletedAt IS NULL`,
        {
          replacements: { id: row.id },
          type: db.Sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );
    }

    for (const facultyId of toAdd) {
      await db.sequelize.query(
        `INSERT INTO faculty_subject_mapping
         (id, faculty_id, subject_id, semester_id, faculty_role, createdAt, updatedAt)
         VALUES (:id, :facultyId, :subjectId, :semesterId, :facultyRole, NOW(), NOW())`,
        {
          replacements: {
            id: crypto.randomUUID(),
            facultyId,
            subjectId: subject_id,
            semesterId: semester_id,
            facultyRole: faculty_role || 'Primary',
          },
          type: db.Sequelize.QueryTypes.INSERT,
          transaction,
        }
      );
    }
  });

  return getMappingDetailBySubject(scope, user, subject_id, semester_id);
};

const deleteMapping = async (scope, user, mappingId) => {
  const [mapping] = await db.sequelize.query(
    `SELECT fsm.id, fsm.subject_id, fsm.faculty_id, fsm.semester_id
     FROM faculty_subject_mapping fsm
     WHERE fsm.id = :mappingId AND fsm.deletedAt IS NULL`,
    {
      replacements: { mappingId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!mapping) throwErr('Mapping not found', 404);

  await assertSubjectInScope(scope, user, mapping.subject_id);

  await db.sequelize.query(
    `UPDATE faculty_subject_mapping SET deletedAt = NOW(), updatedAt = NOW()
     WHERE id = :mappingId`,
    {
      replacements: { mappingId },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  return { message: 'Mapping removed successfully' };
};

const listMySubjects = async (scope, user) => {
  if (!isFacultyRole(user) || !scope?.faculty_id) {
    throwErr('Access denied: faculty profile required', 403);
  }

  return db.sequelize.query(
    `SELECT s.subject_id, s.subject_name, s.subject_code,
            d.depart_name,
            fsm.faculty_role,
            CONCAT('Sem ', sem.semester_number, ' - ', sem.term_type) AS semester_label,
            fsm.semester_id
     FROM faculty_subject_mapping fsm
     JOIN subject s ON s.subject_id = fsm.subject_id AND s.deletedAt IS NULL
     ${SUBJECT_DEPT_JOIN}
     JOIN semester sem ON sem.semester_id = fsm.semester_id
     WHERE fsm.faculty_id = :facultyId AND fsm.deletedAt IS NULL
     ORDER BY s.subject_name ASC`,
    {
      replacements: { facultyId: scope.faculty_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
};

module.exports = {
  listMappings,
  getMappingDetailBySubject,
  listDepartmentFaculty,
  listDepartmentSemesters,
  listDepartmentSubjects,
  getFacultyAllocationPanel,
  upsertMappingsForFaculty,
  upsertMappingsForSubject,
  deleteMapping,
  listMySubjects,
};
