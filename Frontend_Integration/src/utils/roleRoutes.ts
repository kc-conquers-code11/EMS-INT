export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  COE: 'COE',
  HOD: 'HOD',
  FACULTY: 'Faculty',
  STUDENT: 'Student',
} as const;

export const STUDENT_HOME = '/student/exam-registration';
export const FACULTY_HOME = '/faculty/question-paper';
export const HOD_HOME = '/hod/subject-faculty-mapping';
export const COE_HOME = '/semester';
export const SUPER_ADMIN_HOME = '/institution-list';

export const STUDENT_LOGIN = '/login';
export const FACULTY_LOGIN = '/faculty-login';

export const isStudentRole = (role?: string | null) =>
  String(role || '').trim() === ROLES.STUDENT;

export const isFacultyRole = (role?: string | null) =>
  String(role || '').trim() === ROLES.FACULTY;

export const isCoeRole = (role?: string | null) => String(role || '').trim() === ROLES.COE;

export const isHodRole = (role?: string | null) => String(role || '').trim() === ROLES.HOD;

export const isSuperAdminRole = (role?: string | null) =>
  String(role || '').trim() === ROLES.SUPER_ADMIN;

export const isStudentPath = (pathname: string) => pathname.startsWith('/student');

export const isFacultyPath = (pathname: string) => pathname.startsWith('/faculty');

export const isHodPath = (pathname: string) => pathname.startsWith('/hod');

export const isLoginPath = (pathname: string) =>
  pathname === STUDENT_LOGIN || pathname === FACULTY_LOGIN;

export const homePathForRole = (role?: string | null): string => {
  if (isSuperAdminRole(role)) return SUPER_ADMIN_HOME;
  if (isCoeRole(role)) return COE_HOME;
  if (isHodRole(role)) return HOD_HOME;
  if (isFacultyRole(role)) return FACULTY_HOME;
  if (isStudentRole(role)) return STUDENT_HOME;
  return STUDENT_LOGIN;
};

export const loginPathForRole = (role?: string | null): string => {
  if (isFacultyRole(role) || isHodRole(role)) return FACULTY_LOGIN;
  return STUDENT_LOGIN;
};
