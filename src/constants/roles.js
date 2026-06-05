const SCOPE_LEVEL = {
  GLOBAL: 'GLOBAL',
  INSTITUTION: 'INSTITUTION',
  DEPARTMENT: 'DEPARTMENT',
  SELF: 'SELF',
};

const USER_TYPES = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  FACULTY: 2,
  STUDENT: 3,
};

const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  COE: 'COE',
  HOD: 'HOD',
  FACULTY: 'Faculty',
  STUDENT: 'Student',
};

const normalizeRole = (role) => String(role || '').trim().toLowerCase();

const isSuperAdmin = (role) =>
  normalizeRole(role) === 'superadmin' || normalizeRole(role) === 'admin';

const isCoe = (role) => normalizeRole(role) === 'coe';

const isHod = (role) => normalizeRole(role) === 'hod';

const isFaculty = (role) => normalizeRole(role) === 'faculty';

const isStudent = (role) => normalizeRole(role) === 'student';

module.exports = {
  SCOPE_LEVEL,
  USER_TYPES,
  ROLES,
  normalizeRole,
  isSuperAdmin,
  isCoe,
  isHod,
  isFaculty,
  isStudent,
};
