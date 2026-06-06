const { isStudentUser } = require('./role.middleware');

const hasPermission = (user, code) => (user?.permissions || []).includes(code);

/**
 * Student must have hall_ticket:download and only access own studentId param.
 */
const authorizeHallTicketDownload = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!isStudentUser(req.user)) {
    return next();
  }

  if (!hasPermission(req.user, 'hall_ticket:download')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: hall_ticket:download permission required',
    });
  }

  const paramStudentId = req.params?.studentId;
  if (paramStudentId && req.user.student_id && paramStudentId !== req.user.student_id) {
    return res.status(403).json({
      success: false,
      message: 'You can only download your own hall ticket',
    });
  }

  next();
};

/**
 * Student must have hall_ticket:view.
 */
const authorizeHallTicketView = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!isStudentUser(req.user)) {
    return next();
  }

  if (!hasPermission(req.user, 'hall_ticket:view')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: hall_ticket:view permission required',
    });
  }

  next();
};

module.exports = {
  authorizeHallTicketDownload,
  authorizeHallTicketView,
};
