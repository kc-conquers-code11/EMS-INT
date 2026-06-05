const { randomUUID: uuidv4 } = require('crypto');
const db = require('../../../models');
const {
  buildStudentScopeClause,
  assertStudentInScope,
} = require('../../helpers/scope.helper.js');

const throwErr = (msg, status) => {
  const err = new Error(msg);
  err.status = status;
  throw err;
};

// ------------------------------------------------------------------
// RAW QUERIES (GET Operations)
// ------------------------------------------------------------------

const getAllStudents = async (query = {}, scope = null) => {
  const replacements = {
    branch_id: query.branch_id || null,
    programm_id: query.programm_id || null,
    academic_year: query.academic_year || null,
    search: query.q ? `%${query.q}%` : null,
    limit: Math.min(parseInt(query.limit) || 20, 100),
    offset: parseInt(query.offset) || 0,
  };

  const { clause: scopeClause, replacements: scopeReplacements } =
    buildStudentScopeClause(scope, 's');
  const scopeSql = scopeClause ? `AND ${scopeClause}` : '';

  const data = await db.sequelize.query(
    `
    SELECT s.*,
            pd.first_name, pd.last_name, pd.email, pd.contact, pd.dob, b.branch_name, p.programme_name
    FROM students s
    LEFT JOIN student_personaldetails pd ON s.personal_details_id = pd.personal_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN programme p ON s.program_id = p.programm_id
    WHERE s.deletedAt IS NULL AND pd.deletedAt IS NULL
      AND (:branch_id IS NULL OR s.branch_id = :branch_id)
      AND (:programm_id IS NULL OR s.program_id = :programm_id)
      AND (:academic_year IS NULL OR s.academic_year = :academic_year)
      AND (:search IS NULL OR pd.first_name LIKE :search OR pd.last_name LIKE :search OR pd.email LIKE :search)
      ${scopeSql}
    ORDER BY s.createdAt DESC LIMIT :limit OFFSET :offset
  `,
    {
      replacements: { ...replacements, ...scopeReplacements },
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const [countResult] = await db.sequelize.query(
    `
    SELECT COUNT(*) as total FROM students s
    LEFT JOIN student_personaldetails pd ON s.personal_details_id = pd.personal_id
    WHERE s.deletedAt IS NULL AND pd.deletedAt IS NULL
      AND (:branch_id IS NULL OR s.branch_id = :branch_id)
      AND (:programm_id IS NULL OR s.program_id = :programm_id)
      AND (:academic_year IS NULL OR s.academic_year = :academic_year)
      AND (:search IS NULL OR pd.first_name LIKE :search OR pd.last_name LIKE :search OR pd.email LIKE :search)
      ${scopeSql}
  `,
    {
      replacements: { ...replacements, ...scopeReplacements },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    data,
    total: parseInt(countResult?.total || 0),
    limit: replacements.limit,
    offset: replacements.offset,
  };
};

const getStudentById = async (sid, scope = null) => {
  await assertStudentInScope(scope, sid);
  const [student] = await db.sequelize.query(
    `
    SELECT s.*,
           pd.personal_id, pd.first_name, pd.last_name, pd.email, pd.contact, pd.dob, pd.gender_id,
           f.fullname AS father_name, f.contact AS father_contact,
           ra.address AS residential_address, ra.city AS residential_city, ra.state AS residential_state, ra.pincode AS residential_pincode,
           pa.address AS permanent_address, pa.city AS permanent_city, pa.state AS permanent_state, pa.pincode AS permanent_pincode,
           b.branch_name, p.programme_name
    FROM students s
    LEFT JOIN student_personaldetails pd ON s.personal_details_id = pd.personal_id
    LEFT JOIN student_parentdetail f ON s.father_id = f.parent_id
    LEFT JOIN student_add ra ON pd.radd_id = ra.sadd_id
    LEFT JOIN student_add pa ON pd.padd_id = pa.sadd_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN programme p ON s.program_id = p.programm_id
    WHERE s.sid = :sid AND s.deletedAt IS NULL LIMIT 1
  `,
    { replacements: { sid }, nest: true, type: db.Sequelize.QueryTypes.SELECT }
  );

  return student || null;
};

const getDeletedStudents = async (dbContext) => {
  return await db.sequelize.query(
    `
    SELECT s.sid, s.stud_clg_id, s.gr_number, s.academic_year, s.branch_id, s.program_id, s.deletedAt, s.createdAt,
           pd.first_name, pd.last_name, pd.email, pd.contact
    FROM students s
    LEFT JOIN student_personaldetails pd ON s.personal_details_id = pd.personal_id
    WHERE s.deletedAt IS NOT NULL ORDER BY s.deletedAt DESC
  `,
    { nest: true, type: db.Sequelize.QueryTypes.SELECT }
  );
};

// ------------------------------------------------------------------
// DEPENDENCY CHECKER
// ------------------------------------------------------------------

const checkStudent = async (sid) => {
  const student = await db.students.findByPk(sid, { paranoid: false });
  if (!student) throwErr('Student not found', 404);

  const usersCount = await db.users.count({ where: { student_id: sid } });

  return {
    success: true,
    hasDependencies: usersCount > 0,
    warning:
      usersCount > 0
        ? `This student is linked to ${usersCount} user account(s) and associated personal details. Permanently deleting this student will forcefully erase all linked access and demographic data.`
        : 'No active user account found. Safe to permanently delete.',
  };
};

// ------------------------------------------------------------------
// SEQUELIZE ORM (Mutations)
// ------------------------------------------------------------------

const createStudent = async (payload) => {
  if (!payload || !payload.personal || !payload.student) {
    throwErr(
      'Invalid payload structure: missing "personal" or "student" data',
      400
    );
  }

  const {
    student,
    personal,
    permanent_address = {},
    residential_address = {},
    parent = {},
  } = payload;

  const NIL_UUID = '00000000-0000-0000-0000-000000000000';
  const genderMap = { Male: 1, Female: 2, Other: 3 };

  const studentType = await db.user_types.findOne({
    where: { base: 'Student' },
  });
  if (!studentType) throwErr('Student user type not configured', 500);

  if (await db.users.findOne({ where: { email: personal.email } }))
    throwErr('Email already exists', 400);

  return await db.sequelize.transaction(async (t) => {
    const [raddId, paddId, parentId, personalId, sid, uid] = Array.from(
      { length: 6 },
      uuidv4
    );

    await db.student_add.bulkCreate(
      [
        { sadd_id: raddId, ...residential_address },
        { sadd_id: paddId, ...permanent_address },
      ],
      { transaction: t }
    );

    await db.student_parentdetail.create(
      {
        parent_id: parentId,
        fullname: parent.father_name,
        contact: parent.father_contact,
      },
      { transaction: t }
    );

    await db.student_personaldetails.create(
      {
        personal_id: personalId,
        stud_id: sid,
        first_name: personal.first_name,
        last_name: personal.last_name,
        dob: personal.dob,
        gender_id: genderMap[personal.gender],
        email: personal.email,
        contact: personal.contact,
        radd_id: raddId,
        padd_id: paddId,
      },
      { transaction: t }
    );

    await db.users.create(
      {
        uid,
        email: personal.email,
        user_type: studentType.utid,
        student_id: sid,
        is_active: true,
      },
      { transaction: t }
    );

    await db.students.create(
      {
        sid,
        uid,
        program_id: student.programm_id,
        branch_id: student.branch_id,
        gr_number: student.gr_number,
        academic_year: student.academic_year,
        personal_details_id: personalId,
        father_id: parentId,
        mother_id: NIL_UUID,
        guardian_id: NIL_UUID,
        cat_id: NIL_UUID,
        seat_type_id: NIL_UUID,
        doc_ids: NIL_UUID,
        dd_id: NIL_UUID,
        neft_id: NIL_UUID,
      },
      { transaction: t }
    );

    return { sid };
  });
};

const updateStudent = async (sid, payload) => {
  const { student, personal } = payload;

  return await db.sequelize.transaction(async (t) => {
    const st = await db.students.findByPk(sid, { transaction: t });
    if (!st) throwErr('Student not found', 404);

    if (student && Object.keys(student).length > 0) {
      await st.update(
        {
          gr_number: student.gr_number,
          academic_year: student.academic_year,
          branch_id: student.branch_id,
          program_id: student.programm_id,
        },
        { transaction: t }
      );
    }

    if (personal && Object.keys(personal).length > 0) {
      const pd = await db.student_personaldetails.findByPk(
        st.personal_details_id,
        { transaction: t }
      );
      if (pd)
        await pd.update(
          {
            first_name: personal.first_name,
            last_name: personal.last_name,
            email: personal.email,
            contact: personal.contact,
            dob: personal.dob,
          },
          { transaction: t }
        );
    }
    return { sid };
  });
};

const deleteStudent = async (sid) => {
  const student = await db.students.findByPk(sid);
  if (!student) throwErr('Student not found or already deleted', 404);
  await student.destroy();
};

const restoreStudent = async (sid) => {
  const student = await db.students.findByPk(sid, { paranoid: false });
  if (!student || !student.deletedAt)
    throwErr('Student not found or not deleted', 404);
  await student.restore();
};

const permanentDeleteStudent = async (sid) => {
  return await db.sequelize.transaction(async (t) => {
    const st = await db.students.findByPk(sid, {
      paranoid: false,
      transaction: t,
    });
    if (!st) throwErr('Student not found', 404);

    await db.users.destroy({
      where: { student_id: sid },
      transaction: t,
      force: true,
    });
    await st.destroy({ transaction: t, force: true });

    const pd = await db.student_personaldetails.findByPk(
      st.personal_details_id,
      { transaction: t }
    );
    if (pd) {
      await pd.destroy({ transaction: t, force: true });
      await db.student_add.destroy({
        where: { sadd_id: [pd.radd_id, pd.padd_id].filter(Boolean) },
        transaction: t,
        force: true,
      });
    }

    // Inline parent IDs array resolution ignoring NIL_UUID
    await db.student_parentdetail.destroy({
      where: {
        parent_id: [st.father_id, st.mother_id, st.guardian_id].filter(
          (id) => id && id !== '00000000-0000-0000-0000-000000000000'
        ),
      },
      transaction: t,
      force: true,
    });
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  permanentDeleteStudent,
  getDeletedStudents,
  checkStudent,
};
