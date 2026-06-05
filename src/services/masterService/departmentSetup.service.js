const crypto = require('crypto');
const db = require('../../../models');
const emailService = require('../email.service.js');
const {
  getDefaultFacultyTypeId,
  resolveBranchId,
  assertUniqueHodEmail,
  assertUniqueFacultyContactOrEmail,
  assertUniqueUserEmail,
  createHodRecord,
  createFacultyRecord,
  setUserActiveByEntity,
} = require('../../helpers/departmentSetup.helper.js');
const {
  mapDepartmentSetupError,
  assertDistinctEmailsInSetup,
} = require('../../helpers/departmentSetup.errors.js');

const formatDepartmentSetupResponse = async (department) => {
  const hod = department.hod_id
    ? await db.hod.findOne({
        where: { hod_id: department.hod_id, is_deleted: false },
      })
    : null;

  const facultyMembers = await db.faculty.findAll({
    where: { depart_id: department.depart_id, is_deleted: false },
    order: [['createdAt', 'ASC']],
  });

  return {
    department: department.toJSON(),
    hod: hod ? hod.toJSON() : null,
    faculty_members: facultyMembers.map((f) => f.toJSON()),
  };
};

const createDepartmentSetup = async (payload, createdBy) => {
  try {
    return await createDepartmentSetupInternal(payload, createdBy);
  } catch (error) {
    throw mapDepartmentSetupError(error);
  }
};

const createDepartmentSetupInternal = async (payload, createdBy) => {
  assertDistinctEmailsInSetup(payload);

  const institution = await db.institution.findByPk(payload.institution_id);
  if (!institution) {
    throw { status: 404, message: 'Institution not found' };
  }

  const duplicate = await db.department.findOne({
    where: {
      depart_name: payload.department.depart_name,
      institution_id: payload.institution_id,
      is_deleted: false,
    },
  });
  if (duplicate) {
    throw {
      status: 400,
      message: 'Department with this name already exists in the institution',
    };
  }

  const institutionName = institution.name;
  const departmentName = payload.department.depart_name;

  const txResult = await db.sequelize.transaction(async (transaction) => {
    const departId = crypto.randomUUID();
    const ftypeId = await getDefaultFacultyTypeId(transaction);

    const department = await db.department.create(
      {
        depart_id: departId,
        institution_id: payload.institution_id,
        depart_name: payload.department.depart_name,
        depart_code: payload.department.depart_code || null,
        total_faculties: payload.department.total_faculties,
        total_students: payload.department.total_students,
        courses_offered: payload.department.courses_offered || null,
        workflow_status: 'ACTIVE',
        status: true,
        is_deleted: false,
      },
      { transaction }
    );

    const { hod, credentials: hodCredential } = await createHodRecord(
      {
        hodData: payload.hod,
        departId,
        institutionId: payload.institution_id,
        createdBy,
      },
      transaction
    );

    await department.update({ hod_id: hod.hod_id }, { transaction });

    const teacherRecords = [];
    const facultyCredentials = [];
    for (const teacher of payload.faculty_members) {
      const teacherBranchId = await resolveBranchId(
        departId,
        teacher.branch_id,
        transaction
      );
      const { faculty, credentials } = await createFacultyRecord(
        {
          teacher,
          departId,
          branchId: teacherBranchId,
          ftypeId,
          createdBy,
        },
        transaction
      );
      teacherRecords.push(faculty);
      facultyCredentials.push(credentials);
    }

    return {
      department: (await department.reload({ transaction })).toJSON(),
      hod: hod.toJSON(),
      faculty_members: teacherRecords.map((t) => t.toJSON()),
      hodCredential,
      facultyCredentials,
    };
  });

  const email_delivery = await emailService.sendDepartmentRegistrationEmails({
    hodCredential: txResult.hodCredential,
    facultyCredentials: txResult.facultyCredentials,
    institutionName,
    departmentName,
  });

  return {
    department: txResult.department,
    hod: txResult.hod,
    faculty_members: txResult.faculty_members,
    email_delivery,
  };
};

const getDepartmentSetup = async (departId) => {
  const department = await db.department.findOne({
    where: { depart_id: departId, is_deleted: false },
  });
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }
  return formatDepartmentSetupResponse(department);
};

const updateDepartmentSetup = async (departId, payload, updatedBy) => {
  try {
    return await updateDepartmentSetupInternal(departId, payload, updatedBy);
  } catch (error) {
    throw mapDepartmentSetupError(error);
  }
};

const updateDepartmentSetupInternal = async (departId, payload, updatedBy) => {
  if (payload.hod?.email || payload.faculty_members?.length) {
    assertDistinctEmailsInSetup({
      hod: payload.hod || {},
      faculty_members: payload.faculty_members || [],
    });
  }

  const department = await db.department.findOne({
    where: { depart_id: departId, is_deleted: false },
  });
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  const institution = await db.institution.findByPk(department.institution_id);
  const institutionName = institution ? institution.name : 'Institution';
  const departmentName =
    payload.department?.depart_name || department.depart_name;

  const pendingEmails = { hodCredential: null, facultyCredentials: [] };

  await db.sequelize.transaction(async (transaction) => {
    const ftypeId = await getDefaultFacultyTypeId(transaction);

    if (payload.institution_id) {
      const institution = await db.institution.findByPk(payload.institution_id, {
        transaction,
      });
      if (!institution) throw { status: 404, message: 'Institution not found' };
    }

    if (payload.department) {
      if (payload.department.depart_name) {
        const institutionId =
          payload.institution_id || department.institution_id;
        const existing = await db.department.findOne({
          where: {
            depart_name: payload.department.depart_name,
            institution_id: institutionId,
            depart_id: { [db.Sequelize.Op.ne]: departId },
            is_deleted: false,
          },
          transaction,
        });
        if (existing) {
          throw {
            status: 400,
            message: 'Department with this name already exists in the institution',
          };
        }
      }

      await department.update(
        {
          ...(payload.institution_id && { institution_id: payload.institution_id }),
          ...payload.department,
          workflow_status: 'ACTIVE',
        },
        { transaction }
      );
    }

    if (payload.hod) {
      const hodId = payload.hod.hod_id || department.hod_id;
      let hodRecord = hodId
        ? await db.hod.findOne({ where: { hod_id: hodId }, transaction })
        : null;

      if (payload.hod.email) {
        await assertUniqueHodEmail(payload.hod.email, transaction, hodRecord?.hod_id);
        if (hodRecord?.user_id) {
          await assertUniqueUserEmail(
            payload.hod.email,
            transaction,
            hodRecord.user_id
          );
        } else {
          await assertUniqueUserEmail(payload.hod.email, transaction);
        }
      }

      if (hodRecord) {
        await hodRecord.update(
          {
            ...(payload.hod.name && { name: payload.hod.name }),
            ...(payload.hod.employee_code && {
              employee_id: payload.hod.employee_code,
            }),
            ...(payload.hod.mobile_number && {
              phone_number: payload.hod.mobile_number,
            }),
            ...(payload.hod.email && { email: payload.hod.email }),
            ...(payload.hod.personal_email !== undefined && {
              personal_email: payload.hod.personal_email || null,
            }),
            ...(payload.hod.gender && { gender: payload.hod.gender }),
            ...(payload.hod.qualification && {
              qualification: payload.hod.qualification,
            }),
            ...(payload.hod.specialization && {
              specialization: payload.hod.specialization,
            }),
            ...(payload.hod.designation && {
              designation: payload.hod.designation,
            }),
            ...(payload.hod.experience_years !== undefined && {
              experience_years: payload.hod.experience_years,
            }),
            ...(payload.hod.joining_date && {
              joining_date: payload.hod.joining_date,
            }),
            ...(payload.hod.profile_photo !== undefined && {
              profile_photo: payload.hod.profile_photo || null,
            }),
            depart_id: departId,
            institution_id: payload.institution_id || department.institution_id,
            status: true,
            is_deleted: false,
            updated_by: updatedBy || null,
          },
          { transaction }
        );

        if (payload.hod.email && hodRecord.user_id) {
          await db.users.update(
            { email: payload.hod.email, is_active: true },
            { where: { uid: hodRecord.user_id }, transaction }
          );
        }
      } else {
        const { hod: newHod, credentials } = await createHodRecord(
          {
            hodData: payload.hod,
            departId,
            institutionId: payload.institution_id || department.institution_id,
            createdBy: updatedBy,
          },
          transaction
        );
        await department.update({ hod_id: newHod.hod_id }, { transaction });
        pendingEmails.hodCredential = credentials;
      }
    }

    if (payload.faculty_members) {
      const incomingIds = payload.faculty_members
        .filter((t) => t.faculty_id)
        .map((t) => t.faculty_id);

      const removedFaculty = await db.faculty.findAll({
        where: {
          depart_id: departId,
          is_deleted: false,
          ...(incomingIds.length
            ? { faculty_id: { [db.Sequelize.Op.notIn]: incomingIds } }
            : {}),
        },
        transaction,
      });

      for (const f of removedFaculty) {
        await f.update(
          {
            is_deleted: true,
            status: false,
            deleted_at: new Date(),
            updated_by: updatedBy || null,
          },
          { transaction }
        );
        await setUserActiveByEntity(
          { entityIdField: 'faculty_id', entityId: f.faculty_id, isActive: false },
          transaction
        );
      }

      for (const teacher of payload.faculty_members) {
        const teacherBranchId = await resolveBranchId(
          departId,
          teacher.branch_id,
          transaction
        );

        if (teacher.faculty_id) {
          const existing = await db.faculty.findOne({
            where: { faculty_id: teacher.faculty_id, depart_id: departId },
            transaction,
          });
          if (existing) {
            if (teacher.college_email) {
              await assertUniqueFacultyContactOrEmail(
                {
                  contact: teacher.mobile_number,
                  email: teacher.college_email,
                  excludeFacultyId: teacher.faculty_id,
                },
                transaction
              );
              await assertUniqueUserEmail(
                teacher.college_email,
                transaction,
                existing.uid
              );
            }

            await existing.update(
              {
                name: teacher.name,
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
                branch_id: teacherBranchId,
                status: true,
                is_deleted: false,
                deleted_at: null,
                restored_at: new Date(),
                updated_by: updatedBy || null,
              },
              { transaction }
            );

            await db.users.update(
              {
                email: teacher.college_email,
                is_active: true,
              },
              { where: { uid: existing.uid }, transaction }
            );
            continue;
          }
        }

        const { credentials } = await createFacultyRecord(
          {
            teacher,
            departId,
            branchId: teacherBranchId,
            ftypeId,
            createdBy: updatedBy,
          },
          transaction
        );
        pendingEmails.facultyCredentials.push(credentials);
      }
    }
  });

  const email_delivery = await emailService.sendDepartmentRegistrationEmails({
    hodCredential: pendingEmails.hodCredential,
    facultyCredentials: pendingEmails.facultyCredentials,
    institutionName,
    departmentName,
  });

  const setup = await getDepartmentSetup(departId);
  return { ...setup, email_delivery };
};

const softDeleteDepartmentSetup = async (departId, deletedBy) => {
  const department = await db.department.findOne({
    where: { depart_id: departId, is_deleted: false },
  });
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  return db.sequelize.transaction(async (transaction) => {
    await department.update(
      { is_deleted: true, status: false, workflow_status: 'DRAFT' },
      { transaction }
    );

    if (department.hod_id) {
      const hod = await db.hod.findByPk(department.hod_id, { transaction });
      if (hod) {
        await hod.update(
          {
            is_deleted: true,
            status: false,
            deleted_at: new Date(),
            updated_by: deletedBy || null,
          },
          { transaction }
        );
        await setUserActiveByEntity(
          { entityIdField: 'hod_id', entityId: hod.hod_id, isActive: false },
          transaction
        );
      }
    }

    const facultyList = await db.faculty.findAll({
      where: { depart_id: departId, is_deleted: false },
      transaction,
    });

    for (const f of facultyList) {
      await f.update(
        {
          is_deleted: true,
          status: false,
          deleted_at: new Date(),
          updated_by: deletedBy || null,
        },
        { transaction }
      );
      await setUserActiveByEntity(
        { entityIdField: 'faculty_id', entityId: f.faculty_id, isActive: false },
        transaction
      );
    }

    return {
      message:
        'Department, HOD, faculty, and linked user accounts deactivated successfully',
    };
  });
};

const restoreDepartmentSetup = async (departId, restoredBy) => {
  const department = await db.department.findOne({
    where: { depart_id: departId, is_deleted: true },
  });
  if (!department) {
    throw { status: 404, message: 'Deleted department not found' };
  }

  return db.sequelize.transaction(async (transaction) => {
    await department.update(
      { is_deleted: false, status: true, workflow_status: 'ACTIVE' },
      { transaction }
    );

    if (department.hod_id) {
      const hod = await db.hod.findByPk(department.hod_id, { transaction });
      if (hod) {
        await hod.update(
          {
            is_deleted: false,
            status: true,
            restored_at: new Date(),
            deleted_at: null,
            updated_by: restoredBy || null,
          },
          { transaction }
        );
        await setUserActiveByEntity(
          { entityIdField: 'hod_id', entityId: hod.hod_id, isActive: true },
          transaction
        );
      }
    }

    const facultyList = await db.faculty.findAll({
      where: { depart_id: departId },
      transaction,
    });

    for (const f of facultyList) {
      await f.update(
        {
          is_deleted: false,
          status: true,
          restored_at: new Date(),
          deleted_at: null,
          updated_by: restoredBy || null,
        },
        { transaction }
      );
      await setUserActiveByEntity(
        { entityIdField: 'faculty_id', entityId: f.faculty_id, isActive: true },
        transaction
      );
    }

    return {
      message:
        'Department, HOD, faculty, and linked user accounts restored successfully',
    };
  });
};

module.exports = {
  createDepartmentSetup,
  getDepartmentSetup,
  updateDepartmentSetup,
  softDeleteDepartmentSetup,
  restoreDepartmentSetup,
};
