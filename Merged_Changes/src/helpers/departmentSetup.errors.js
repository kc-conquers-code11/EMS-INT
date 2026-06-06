/**
 * Map Sequelize / DB errors to API-friendly { status, message } objects.
 */
const mapDepartmentSetupError = (error) => {
  const message = String(error?.message || '');
  if (message.toLowerCase().includes('data too long')) {
    return {
      status: 400,
      message:
        'One or more profile photos are too large for storage. Try a smaller image or submit without photos.',
    };
  }

  if (error?.status && error?.message) {
    return error;
  }

  if (error?.name === 'SequelizeUniqueConstraintError') {
    const item = error.errors?.[0];
    const path = item?.path || '';
    const value = item?.value ?? '';

    if (path.includes('email') || path.includes('idx_hod_email')) {
      return {
        status: 400,
        message: `Email "${value}" is already registered. Use a different email for the HOD and each faculty member (including your login email if it is already in use).`,
      };
    }
    if (path.includes('contact')) {
      return {
        status: 400,
        message: `Mobile number "${value}" is already registered for another faculty member.`,
      };
    }
    return {
      status: 400,
      message: 'A record with these details already exists. Please check email and mobile numbers.',
    };
  }

  if (
    error?.name === 'SequelizeDatabaseError' &&
    String(error?.message || '').toLowerCase().includes('data too long')
  ) {
    return {
      status: 400,
      message:
        'One or more profile photos are too large for storage. Try a smaller image or submit without photos.',
    };
  }

  if (error?.name === 'SequelizeForeignKeyConstraintError') {
    return {
      status: 400,
      message: 'Invalid reference data. Please verify institution and related IDs.',
    };
  }

  return {
    status: 500,
    message: error?.message || 'Internal server error',
  };
};

const assertDistinctEmailsInSetup = (payload) => {
  const seen = new Set();

  const check = (email, label) => {
    const key = email.trim().toLowerCase();
    if (seen.has(key)) {
      throw {
        status: 400,
        message: `Duplicate email in form: "${email}" is used more than once. HOD and each faculty must have unique emails.`,
      };
    }
    seen.add(key);
  };

  if (payload.hod?.email) {
    check(payload.hod.email, 'HOD');
  }

  for (const teacher of payload.faculty_members || []) {
    if (teacher.college_email) {
      check(teacher.college_email, 'Faculty');
    }
  }
};

module.exports = {
  mapDepartmentSetupError,
  assertDistinctEmailsInSetup,
};
