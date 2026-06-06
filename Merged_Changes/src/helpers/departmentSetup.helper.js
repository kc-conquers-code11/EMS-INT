const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../models');
const { getUserTypeId } = require('./userType.helper.js');

const generateTemporaryPassword = () => crypto.randomBytes(8).toString('hex');

const getDefaultFacultyTypeId = async (transaction) => {
  const facultyType = await db.faculty_type.findOne({
    order: [['createdAt', 'ASC']],
    transaction,
  });
  if (!facultyType) {
    throw { status: 500, message: 'No faculty type configured in the system' };
  }
  return facultyType.ftype_id;
};

const resolveBranchId = async (departId, explicitBranchId, transaction) => {
  if (explicitBranchId) {
    const branch = await db.branch.findOne({
      where: { branch_id: explicitBranchId, depart_id: departId },
      transaction,
    });
    if (branch) return branch.branch_id;
  }

  const existingBranch = await db.branch.findOne({
    where: { depart_id: departId },
    transaction,
  });
  if (existingBranch) return existingBranch.branch_id;

  return departId;
};

const assertUniqueUserEmail = async (email, transaction, excludeUid = null) => {
  const where = {
    email,
    ...(excludeUid ? { uid: { [db.Sequelize.Op.ne]: excludeUid } } : {}),
  };
  // Unique index applies to all rows, including soft-deleted users
  const existing = await db.users.findOne({
    where,
    paranoid: false,
    transaction,
  });
  if (existing) {
    throw {
      status: 400,
      message: `Email ${email} is already registered as a system user. Use a different email.`,
    };
  }
};

const assertUniqueHodEmail = async (
  email,
  transaction,
  excludeHodId = null
) => {
  const where = {
    email,
    ...(excludeHodId ? { hod_id: { [db.Sequelize.Op.ne]: excludeHodId } } : {}),
  };
  const existing = await db.hod.findOne({
    where,
    paranoid: false,
    transaction,
  });
  if (existing) {
    const hint = existing.is_deleted
      ? ' (including a previously removed HOD record)'
      : '';
    throw {
      status: 400,
      message: `HOD email ${email} is already in use${hint}. Please use another email.`,
    };
  }
};

const assertUniqueFacultyContactOrEmail = async (
  { contact, email, excludeFacultyId },
  transaction
) => {
  if (contact) {
    const existingContact = await db.faculty.findOne({
      where: {
        contact,
        ...(excludeFacultyId
          ? { faculty_id: { [db.Sequelize.Op.ne]: excludeFacultyId } }
          : {}),
      },
      paranoid: false,
      transaction,
    });
    if (existingContact) {
      throw {
        status: 400,
        message: `Faculty mobile ${contact} is already registered. Use a different number.`,
      };
    }
  }

  if (email) {
    const existingEmail = await db.faculty.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { college_email: email }],
        ...(excludeFacultyId
          ? { faculty_id: { [db.Sequelize.Op.ne]: excludeFacultyId } }
          : {}),
      },
      paranoid: false,
      transaction,
    });
    if (existingEmail) {
      throw {
        status: 400,
        message: `Faculty email ${email} is already in use. Please use another email.`,
      };
    }
  }
};

/**
 * Create users row + link to entity (COE-style pattern).
 */
const createUserAccount = async (
  { email, userTypeBase, entityIdField, entityId },
  transaction
) => {
  await assertUniqueUserEmail(email, transaction);

  const uid = crypto.randomUUID();
  const temporaryPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
  const userTypeId = await getUserTypeId(userTypeBase, transaction);

  await db.users.create(
    {
      uid,
      email,
      user_type: userTypeId,
      password: hashedPassword,
      [entityIdField]: entityId,
      is_active: true,
    },
    { transaction }
  );

  return { uid, temporaryPassword };
};

const createHodRecord = async (
  { hodData, departId, institutionId, createdBy },
  transaction
) => {
  const hodId = hodData.hod_id || crypto.randomUUID();

  await assertUniqueHodEmail(hodData.email, transaction, hodId);
  await assertUniqueUserEmail(hodData.email, transaction);

  const hod = await db.hod.create(
    {
      hod_id: hodId,
      depart_id: departId,
      institution_id: institutionId,
      name: hodData.name,
      employee_id: hodData.employee_code,
      email: hodData.email,
      phone_number: hodData.mobile_number,
      personal_email: hodData.personal_email || null,
      gender: hodData.gender,
      qualification: hodData.qualification,
      specialization: hodData.specialization,
      designation: hodData.designation,
      experience_years: hodData.experience_years,
      joining_date: hodData.joining_date,
      profile_photo: hodData.profile_photo || null,
      status: true,
      is_deleted: false,
      created_by: createdBy || null,
    },
    { transaction }
  );

  const { uid, temporaryPassword } = await createUserAccount(
    {
      email: hodData.email,
      userTypeBase: 'HOD',
      entityIdField: 'hod_id',
      entityId: hodId,
    },
    transaction
  );

  await hod.update({ user_id: uid }, { transaction });

  return {
    hod,
    credentials: {
      email: hodData.email,
      name: hodData.name,
      employeeId: hodData.employee_code,
      password: temporaryPassword,
    },
  };
};

const createFacultyRecord = async (
  { teacher, departId, branchId, ftypeId, createdBy },
  transaction
) => {
  const facultyId = teacher.faculty_id || crypto.randomUUID();

  await assertUniqueFacultyContactOrEmail(
    {
      contact: teacher.mobile_number,
      email: teacher.college_email,
      excludeFacultyId: facultyId,
    },
    transaction
  );
  await assertUniqueUserEmail(teacher.college_email, transaction);

  const { uid, temporaryPassword } = await createUserAccount(
    {
      email: teacher.college_email,
      userTypeBase: 'Faculty',
      entityIdField: 'faculty_id',
      entityId: facultyId,
    },
    transaction
  );

  const faculty = await db.faculty.create(
    {
      faculty_id: facultyId,
      uid,
      name: teacher.name,
      faculty_clg_id: teacher.employee_code || teacher.faculty_clg_id || null,
      contact: teacher.mobile_number,
      email: teacher.college_email,
      college_email: teacher.college_email,
      personal_email: teacher.personal_email || null,
      gender: teacher.gender,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      designation: teacher.designation,
      experience_years: teacher.experience_years,
      subjects_assigned: teacher.subjects_assigned,
      joining_date: teacher.joining_date,
      profile_photo: teacher.profile_photo || null,
      ftype_id: ftypeId,
      depart_id: departId,
      branch_id: branchId,
      status: true,
      is_deleted: false,
      created_by: createdBy || null,
    },
    { transaction }
  );

  return {
    faculty,
    credentials: {
      email: teacher.college_email,
      name: teacher.name,
      employeeId:
        teacher.employee_code || teacher.faculty_clg_id || 'N/A',
      designation: teacher.designation,
      password: temporaryPassword,
    },
  };
};

const setUserActiveByEntity = async (
  { entityIdField, entityId, isActive },
  transaction
) => {
  const where = { [entityIdField]: entityId };
  await db.users.update(
    { is_active: isActive },
    { where, transaction }
  );
};

module.exports = {
  getDefaultFacultyTypeId,
  resolveBranchId,
  assertUniqueFacultyContactOrEmail,
  assertUniqueHodEmail,
  assertUniqueUserEmail,
  createHodRecord,
  createFacultyRecord,
  createUserAccount,
  setUserActiveByEntity,
};
