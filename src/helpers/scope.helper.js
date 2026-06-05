const db = require('../../models');
const {
  SCOPE_LEVEL,
  normalizeRole,
  isSuperAdmin,
  isCoe,
  isHod,
  isFaculty,
  isStudent,
} = require('../constants/roles.js');

const forbidden = (message = 'Access denied: resource outside your scope') => {
  const err = new Error(message);
  err.status = 403;
  throw err;
};

const notFound = (message = 'Resource not found') => {
  const err = new Error(message);
  err.status = 404;
  throw err;
};

const emptyScope = (user) => ({
  role: user?.role || null,
  uid: user?.uid || null,
  institutionId: null,
  institutionName: null,
  departId: null,
  branchId: null,
  studentId: user?.student_id || null,
  facultyId: user?.faculty_id || null,
  coeId: user?.coe_id || null,
  hodId: user?.hod_id || null,
  unrestricted: false,
  level: SCOPE_LEVEL.SELF,
});

async function resolveUserScope(user) {
  if (!user) return emptyScope(user);

  const role = normalizeRole(user.role);
  const scope = emptyScope(user);

  if (isSuperAdmin(user.role)) {
    scope.unrestricted = true;
    scope.level = SCOPE_LEVEL.GLOBAL;
    return scope;
  }

  if (isCoe(user.role) && user.coe_id) {
    const [row] = await db.sequelize.query(
      `SELECT c.institution_id, i.name AS institution_name
       FROM coe c
       LEFT JOIN institution i ON i.institution_id = c.institution_id
       WHERE c.coe_id = :coeId AND c.status = 1
       LIMIT 1`,
      {
        replacements: { coeId: user.coe_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (row) {
      scope.institutionId = row.institution_id;
      scope.institutionName = row.institution_name;
    }
    scope.level = SCOPE_LEVEL.INSTITUTION;
    return scope;
  }

  if (isHod(user.role) && user.hod_id) {
    const [row] = await db.sequelize.query(
      `SELECT h.institution_id, h.depart_id, i.name AS institution_name, d.depart_name
       FROM hod h
       LEFT JOIN institution i ON i.institution_id = h.institution_id
       LEFT JOIN department d ON d.depart_id = h.depart_id
       WHERE h.hod_id = :hodId
         AND (h.is_deleted = 0 OR h.is_deleted IS NULL)
       LIMIT 1`,
      {
        replacements: { hodId: user.hod_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (row) {
      scope.institutionId = row.institution_id;
      scope.institutionName = row.institution_name;
      scope.departId = row.depart_id;
      scope.departName = row.depart_name;
    }
    scope.level = SCOPE_LEVEL.DEPARTMENT;
    return scope;
  }

  if (isFaculty(user.role) && user.faculty_id) {
    const [row] = await db.sequelize.query(
      `SELECT f.depart_id, f.branch_id, d.institution_id, i.name AS institution_name
       FROM faculty f
       JOIN department d ON d.depart_id = f.depart_id
       LEFT JOIN institution i ON i.institution_id = d.institution_id
       WHERE f.faculty_id = :facultyId
         AND (f.deletedAt IS NULL)
         AND (f.status = 1 OR f.status IS NULL)
       LIMIT 1`,
      {
        replacements: { facultyId: user.faculty_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (row) {
      scope.institutionId = row.institution_id;
      scope.institutionName = row.institution_name;
      scope.departId = row.depart_id;
      scope.branchId = row.branch_id;
    }
    scope.level = SCOPE_LEVEL.DEPARTMENT;
    return scope;
  }

  if (isStudent(user.role) && user.student_id) {
    const [row] = await db.sequelize.query(
      `SELECT s.sid, s.branch_id, b.depart_id, d.institution_id, i.name AS institution_name
       FROM students s
       JOIN branch b ON b.branch_id = s.branch_id
       JOIN department d ON d.depart_id = b.depart_id
       LEFT JOIN institution i ON i.institution_id = d.institution_id
       WHERE s.sid = :studentId AND s.deletedAt IS NULL
       LIMIT 1`,
      {
        replacements: { studentId: user.student_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (row) {
      scope.studentId = row.sid;
      scope.branchId = row.branch_id;
      scope.departId = row.depart_id;
      scope.institutionId = row.institution_id;
      scope.institutionName = row.institution_name;
    }
    scope.level = SCOPE_LEVEL.SELF;
    return scope;
  }

  return scope;
}

function assertInstitutionAccess(scope, institutionId) {
  if (!scope || scope.unrestricted) return;
  if (!institutionId) forbidden('Access denied: institution required');
  if (!scope.institution_id || scope.institution_id !== institutionId) {
    forbidden('Access denied: institution outside your scope');
  }
}

function assertDepartmentAccess(scope, departId) {
  if (!scope || scope.unrestricted) return;
  if (!departId) forbidden('Access denied: department required');
  if (scope.level === SCOPE_LEVEL.INSTITUTION) return;
  if (
    (scope.level === SCOPE_LEVEL.DEPARTMENT || scope.level === SCOPE_LEVEL.SELF) &&
    scope.depart_id &&
    scope.depart_id !== departId
  ) {
    forbidden('Access denied: department outside your scope');
  }
}

function assertStudentSelf(scope, studentId) {
  if (!scope || scope.unrestricted) return;
  if (scope.level !== SCOPE_LEVEL.SELF) return;
  if (!scope.student_id || scope.student_id !== studentId) {
    forbidden('Access denied: you can only access your own records');
  }
}

function enforceInstitutionId(scope, requestedInstitutionId) {
  if (!scope || scope.unrestricted) return requestedInstitutionId || null;
  if (!scope.institution_id) forbidden('Access denied: no institution assigned');
  if (requestedInstitutionId && requestedInstitutionId !== scope.institution_id) {
    forbidden('Access denied: institution outside your scope');
  }
  return scope.institution_id;
}

function enforceDepartmentId(scope, requestedDepartId) {
  if (!scope || scope.unrestricted) return requestedDepartId || null;
  if (scope.level === SCOPE_LEVEL.INSTITUTION) {
    return requestedDepartId || null;
  }
  if (!scope.depart_id) forbidden('Access denied: no department assigned');
  if (requestedDepartId && requestedDepartId !== scope.depart_id) {
    forbidden('Access denied: department outside your scope');
  }
  return scope.depart_id;
}

async function assertDepartmentInScope(scope, departId) {
  const [dept] = await db.sequelize.query(
    `SELECT depart_id, institution_id FROM department
     WHERE depart_id = :departId AND deletedAt IS NULL
       AND (is_deleted = 0 OR is_deleted IS NULL)
     LIMIT 1`,
    {
      replacements: { departId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!dept) notFound('Department not found');
  assertInstitutionAccess(scope, dept.institution_id);
  assertDepartmentAccess(scope, dept.depart_id);
  return dept;
}

async function assertStudentInScope(scope, studentId) {
  const [student] = await db.sequelize.query(
    `SELECT s.sid, b.depart_id, d.institution_id
     FROM students s
     JOIN branch b ON b.branch_id = s.branch_id
     JOIN department d ON d.depart_id = b.depart_id
     WHERE s.sid = :studentId AND s.deletedAt IS NULL
     LIMIT 1`,
    {
      replacements: { studentId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!student) notFound('Student not found');
  assertInstitutionAccess(scope, student.institution_id);
  assertDepartmentAccess(scope, student.depart_id);
  assertStudentSelf(scope, student.sid);
  return student;
}

function buildDepartmentWhere(scope, tableAlias = 'd') {
  const s = scope?.unrestricted ? null : scope;
  if (!s) return { clause: '', replacements: {} };
  const replacements = {};
  const parts = [];
  if (s.institution_id) {
    parts.push(`${tableAlias}.institution_id = :scopeInstitutionId`);
    replacements.scopeInstitutionId = s.institution_id;
  }
  if (s.level === SCOPE_LEVEL.DEPARTMENT && s.depart_id) {
    parts.push(`${tableAlias}.depart_id = :scopeDepartId`);
    replacements.scopeDepartId = s.depart_id;
  }
  return {
    clause: parts.length ? parts.join(' AND ') : '',
    replacements,
  };
}

function buildStudentScopeClause(scope, tableAlias = 's') {
  const s = scope?.unrestricted ? null : scope;
  if (!s) return { clause: '', replacements: {} };
  const replacements = {};
  const parts = [];

  if (s.level === SCOPE_LEVEL.SELF && s.student_id) {
    parts.push(`${tableAlias}.sid = :scopeStudentId`);
    replacements.scopeStudentId = s.student_id;
    return { clause: parts.join(' AND '), replacements };
  }

  if (s.institution_id || s.depart_id) {
    parts.push(`EXISTS (
      SELECT 1 FROM branch sb
      JOIN department sd ON sd.depart_id = sb.depart_id
      WHERE sb.branch_id = ${tableAlias}.branch_id
        ${s.institution_id ? 'AND sd.institution_id = :scopeInstitutionId' : ''}
        ${s.depart_id && s.level === SCOPE_LEVEL.DEPARTMENT ? 'AND sd.depart_id = :scopeDepartId' : ''}
    )`);
    if (s.institution_id) replacements.scopeInstitutionId = s.institution_id;
    if (s.depart_id && s.level === SCOPE_LEVEL.DEPARTMENT) {
      replacements.scopeDepartId = s.depart_id;
    }
  }

  return {
    clause: parts.length ? parts.join(' AND ') : '',
    replacements,
  };
}

function buildProgrammeScopeClause(scope, tableAlias = 'p') {
  const s = scope?.unrestricted ? null : scope;
  if (!s) return { clause: '', replacements: {} };
  const replacements = {};
  const parts = [];
  if (s.institution_id) {
    parts.push(`${tableAlias}.institution_id = :scopeInstitutionId`);
    replacements.scopeInstitutionId = s.institution_id;
  }
  if (s.level === SCOPE_LEVEL.DEPARTMENT && s.depart_id) {
    parts.push(`${tableAlias}.depart_id = :scopeDepartId`);
    replacements.scopeDepartId = s.depart_id;
  }
  return {
    clause: parts.length ? parts.join(' AND ') : '',
    replacements,
  };
}

function buildSchemeScopeClause(scope, schemeAlias = 's', programmeAlias = 'p') {
  const joinClause = `INNER JOIN programme ${programmeAlias} ON ${programmeAlias}.programm_id = ${schemeAlias}.programm_id AND ${programmeAlias}.deletedAt IS NULL`;
  const { clause, replacements } = buildProgrammeScopeClause(scope, programmeAlias);

  if (scope && !scope.unrestricted && !scope.institution_id) {
    return { joinClause, clause: '1 = 0', replacements: {} };
  }

  return { joinClause, clause, replacements };
}

async function getProgrammeIdsInScope(scope) {
  if (!scope || scope.unrestricted) return null;
  if (!scope.institution_id) return [];

  const { clause, replacements } = buildProgrammeScopeClause(scope, 'p');
  const whereParts = ['p.deletedAt IS NULL'];
  if (clause) whereParts.push(clause);

  const rows = await db.sequelize.query(
    `SELECT p.programm_id FROM programme p WHERE ${whereParts.join(' AND ')}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return rows.map((row) => row.programm_id);
}

async function assertProgrammeInScope(scope, programmId) {
  const [programmeRow] = await db.sequelize.query(
    `SELECT programm_id, institution_id, depart_id
     FROM programme
     WHERE programm_id = :programmId AND deletedAt IS NULL
     LIMIT 1`,
    {
      replacements: { programmId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!programmeRow) notFound('Programme not found');

  assertInstitutionAccess(scope, programmeRow.institution_id);
  assertDepartmentAccess(scope, programmeRow.depart_id);
  return programmeRow;
}

async function assertSchemeInScope(scope, schemeId, { includeDeleted = false } = {}) {
  const deletedClause = includeDeleted ? '' : 'AND s.deletedAt IS NULL';

  const [schemeRow] = await db.sequelize.query(
    `SELECT s.scheme_id, s.programm_id, p.institution_id, p.depart_id
     FROM scheme s
     INNER JOIN programme p ON p.programm_id = s.programm_id AND p.deletedAt IS NULL
     WHERE s.scheme_id = :schemeId ${deletedClause}
     LIMIT 1`,
    {
      replacements: { schemeId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!schemeRow) notFound('Scheme not found');

  assertInstitutionAccess(scope, schemeRow.institution_id);
  assertDepartmentAccess(scope, schemeRow.depart_id);
  return schemeRow;
}

function scopeToPublic(scope) {
  if (!scope) return null;
  return {
    institution_id: scope.institutionId,
    institution_name: scope.institutionName,
    depart_id: scope.departId,
    depart_name: scope.departName || null,
    branch_id: scope.branchId,
    student_id: scope.studentId,
    faculty_id: scope.facultyId,
    coe_id: scope.coeId,
    hod_id: scope.hodId,
    level: scope.level,
    unrestricted: scope.unrestricted,
  };
}

function attachScopeToUser(user, scope) {
  const publicScope = scopeToPublic(scope);
  return {
    ...user,
    institution_id: publicScope?.institution_id || null,
    institution_name: publicScope?.institution_name || null,
    depart_id: publicScope?.depart_id || null,
    depart_name: publicScope?.depart_name || null,
    branch_id: publicScope?.branch_id || null,
    scope: publicScope,
  };
}

function buildInstitutionScopeClause(scope, tableAlias = 't') {
  const s = scope?.unrestricted ? null : scope;
  if (!s) return { clause: '', replacements: {} };
  if (!s.institution_id) {
    return { clause: '1 = 0', replacements: {} };
  }
  return {
    clause: `${tableAlias}.institution_id = :scopeInstitutionId`,
    replacements: { scopeInstitutionId: s.institution_id },
  };
}

function getEffectiveScope(user) {
  if (!user) return null;
  if (user.scope) return user.scope;
  return scopeToPublic({
    institutionId: user.institution_id,
    institutionName: user.institution_name,
    departId: user.depart_id,
    branchId: user.branch_id,
    studentId: user.student_id,
    facultyId: user.faculty_id,
    coeId: user.coe_id,
    hodId: user.hod_id,
    unrestricted: false,
    level: SCOPE_LEVEL.SELF,
  });
}

module.exports = {
  SCOPE_LEVEL,
  resolveUserScope,
  assertInstitutionAccess,
  assertDepartmentAccess,
  assertStudentSelf,
  enforceInstitutionId,
  enforceDepartmentId,
  assertDepartmentInScope,
  assertStudentInScope,
  buildDepartmentWhere,
  buildStudentScopeClause,
  buildProgrammeScopeClause,
  buildSchemeScopeClause,
  buildInstitutionScopeClause,
  scopeToPublic,
  attachScopeToUser,
  getEffectiveScope,
  getProgrammeIdsInScope,
  assertProgrammeInScope,
  assertSchemeInScope,
};
