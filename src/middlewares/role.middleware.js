/**
 * Role guards aligned with user_types.base and dynamic roles (COE, HOD).
 */

const { USER_TYPES, normalizeRole, isSuperAdmin, isCoe, isHod, isFaculty, isStudent } = require('../constants/roles.js');

const isStudentUser = (user) =>
  user &&
  (user.utid === USER_TYPES.STUDENT || isStudent(user.role));

const isFacultyUser = (user) =>
  user &&
  (user.utid === USER_TYPES.FACULTY || isFaculty(user.role));

const isCoeUser = (user) => user && isCoe(user.role);

const isHodUser = (user) => user && isHod(user.role);

const isSuperAdminUser = (user) =>
  user &&
  (user.utid === USER_TYPES.SUPER_ADMIN ||
    user.utid === USER_TYPES.ADMIN ||
    isSuperAdmin(user.role));

const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!isStudentUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Student role required',
    });
  }
  if (!req.user.student_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: student profile not found',
    });
  }
  next();
};

const requireFaculty = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!isFacultyUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Faculty role required',
    });
  }
  next();
};

const requireHod = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!isHodUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: HOD role required',
    });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!isSuperAdminUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Super Admin role required',
    });
  }
  next();
};

const denyStudents = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (isStudentUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Students cannot access this resource',
    });
  }
  next();
};

module.exports = {
  USER_TYPES,
  isStudentUser,
  isFacultyUser,
  isCoeUser,
  isHodUser,
  isSuperAdminUser,
  requireStudent,
  requireFaculty,
  requireHod,
  requireSuperAdmin,
  denyStudents,
};
