const db = require('../../../models');

const getAllSemesters = async (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM semester
    WHERE deleted_at IS NULL
  `;
  
  const countResult = await db.sequelize.query(countQuery, {
    type: db.sequelize.QueryTypes.SELECT,
  });
  
  const count = parseInt(countResult[0].total, 10);

  const query = `
    SELECT 
      s.*,
      p.programme_name, p.programme_code,
      b.branch_name,
      sch.scheme_name,
      ay.academic_name, ay.current_ay
    FROM semester s
    LEFT JOIN programme p ON s.programme_id = p.programm_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    LEFT JOIN academic_year ay ON s.academic_id = ay.academic_id
    WHERE s.deleted_at IS NULL
    ORDER BY s.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const semestersWithDetails = await db.sequelize.query(query, {
    replacements: { limit: limitNum, offset },
    type: db.sequelize.QueryTypes.SELECT,
  });

  return {
    total: count,
    page: pageNum,
    totalPages: Math.ceil(count / limitNum),
    data: semestersWithDetails,
  };
};

const getSemesterById = async (semester_id) => {
  const query = `
    SELECT 
      s.*,
      p.programme_name, p.programme_code, p.degree_type, p.duration_years,
      b.branch_name,
      sch.scheme_name,
      ay.academic_name, ay.current_ay, ay.is_admission
    FROM semester s
    LEFT JOIN programme p ON s.programme_id = p.programm_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    LEFT JOIN academic_year ay ON s.academic_id = ay.academic_id
    WHERE s.semester_id = :semester_id
  `;

  const result = await db.sequelize.query(query, {
    replacements: { semester_id },
    type: db.sequelize.QueryTypes.SELECT,
  });

  if (!result || result.length === 0) {
    throw { status: 404, message: 'Semester not found' };
  }

  return result[0];
};

const getSemestersByProgramme = async (programme_id, page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const programme = await db.programme.findByPk(programme_id, {
    paranoid: false,
  });

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  const countQuery = `
    SELECT COUNT(*) as total
    FROM semester
    WHERE programme_id = :programme_id AND deleted_at IS NULL
  `;
  
  const countResult = await db.sequelize.query(countQuery, {
    replacements: { programme_id },
    type: db.sequelize.QueryTypes.SELECT,
  });
  const count = parseInt(countResult[0].total, 10);

  const query = `
    SELECT 
      s.*,
      ay.academic_name, ay.current_ay,
      b.branch_name,
      sch.scheme_name
    FROM semester s
    LEFT JOIN academic_year ay ON s.academic_id = ay.academic_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    WHERE s.programme_id = :programme_id AND s.deleted_at IS NULL
    ORDER BY s.semester_number ASC
    LIMIT :limit OFFSET :offset
  `;

  const semestersWithDetails = await db.sequelize.query(query, {
    replacements: { programme_id, limit: limitNum, offset },
    type: db.sequelize.QueryTypes.SELECT,
  });

  return {
    total: count,
    page: pageNum,
    totalPages: Math.ceil(count / limitNum),
    data: semestersWithDetails,
    programme_name: programme.programme_name,
  };
};

const getSemestersByAcademicYear = async (academic_id, page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const academicYear = await db.academic_year.findByPk(academic_id, {
    paranoid: false,
  });

  if (!academicYear) {
    throw { status: 404, message: 'Academic year not found' };
  }

  const countQuery = `
    SELECT COUNT(*) as total
    FROM semester
    WHERE academic_id = :academic_id AND deleted_at IS NULL
  `;
  
  const countResult = await db.sequelize.query(countQuery, {
    replacements: { academic_id },
    type: db.sequelize.QueryTypes.SELECT,
  });
  const count = parseInt(countResult[0].total, 10);

  const query = `
    SELECT 
      s.*,
      p.programme_name, p.programme_code,
      b.branch_name,
      sch.scheme_name
    FROM semester s
    LEFT JOIN programme p ON s.programme_id = p.programm_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    WHERE s.academic_id = :academic_id AND s.deleted_at IS NULL
    ORDER BY s.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const semestersWithDetails = await db.sequelize.query(query, {
    replacements: { academic_id, limit: limitNum, offset },
    type: db.sequelize.QueryTypes.SELECT,
  });

  return {
    total: count,
    page: pageNum,
    totalPages: Math.ceil(count / limitNum),
    data: semestersWithDetails,
    academic_name: academicYear.academic_name,
  };
};

const createSemester = async (validatedData) => {
  const programme = await db.programme.findByPk(validatedData.programme_id, {
    paranoid: false,
  });

  if (!programme) {
    throw { status: 404, message: 'Programme not found. Please select a valid programme.' };
  }

  const academicYear = await db.academic_year.findByPk(validatedData.academic_id, {
    paranoid: false,
  });

  if (!academicYear) {
    throw { status: 404, message: 'Academic year not found. Please select a valid academic year.' };
  }

  if (validatedData.branch_id) {
    const branch = await db.branch.findByPk(validatedData.branch_id, { paranoid: false });
    if (!branch) {
      throw { status: 404, message: 'Branch not found. Please select a valid branch.' };
    }
  }

  if (validatedData.scheme_id) {
    const scheme = await db.scheme.findByPk(validatedData.scheme_id, { paranoid: false });
    if (!scheme) {
      throw { status: 404, message: 'Scheme not found. Please select a valid scheme.' };
    }
  }

  const existingSemester = await db.semester.findOne({
    where: {
      programme_id: validatedData.programme_id,
      academic_id: validatedData.academic_id,
      semester_number: validatedData.semester_number,
    },
  });

  if (existingSemester) {
    throw { status: 400, message: `Semester ${validatedData.semester_number} already exists for this programme and academic year` };
  }

  if (validatedData.is_active) {
    await db.semester.update(
      { is_active: false },
      {
        where: {
          programme_id: validatedData.programme_id,
        },
      }
    );
  }

  const semester = await db.semester.create(validatedData);

  let branch = null;
  let scheme = null;
  if (validatedData.branch_id) {
    branch = await db.branch.findByPk(validatedData.branch_id, { paranoid: false, attributes: ['branch_name'] });
  }
  if (validatedData.scheme_id) {
    scheme = await db.scheme.findByPk(validatedData.scheme_id, { paranoid: false, attributes: ['scheme_name'] });
  }

  return {
    ...semester.toJSON(),
    programme_name: programme.programme_name,
    academic_name: academicYear.academic_name,
    branch_name: branch ? branch.branch_name : null,
    scheme_name: scheme ? scheme.scheme_name : null,
  };
};

const updateSemester = async (semester_id, validatedData) => {
  const semester = await db.semester.findByPk(semester_id);

  if (!semester) {
    throw { status: 404, message: 'Semester not found' };
  }

  if (validatedData.programme_id) {
    const programme = await db.programme.findByPk(validatedData.programme_id, { paranoid: false });
    if (!programme) {
      throw { status: 404, message: 'New programme not found. Please select a valid programme.' };
    }
  }

  if (validatedData.academic_id) {
    const academicYear = await db.academic_year.findByPk(validatedData.academic_id, { paranoid: false });
    if (!academicYear) {
      throw { status: 404, message: 'New academic year not found. Please select a valid academic year.' };
    }
  }

  if (validatedData.branch_id) {
    const branch = await db.branch.findByPk(validatedData.branch_id, { paranoid: false });
    if (!branch) {
      throw { status: 404, message: 'New branch not found. Please select a valid branch.' };
    }
  }

  if (validatedData.scheme_id) {
    const scheme = await db.scheme.findByPk(validatedData.scheme_id, { paranoid: false });
    if (!scheme) {
      throw { status: 404, message: 'New scheme not found. Please select a valid scheme.' };
    }
  }

  if (
    validatedData.programme_id ||
    validatedData.academic_id ||
    validatedData.semester_number
  ) {
    const checkProgrammId = validatedData.programme_id || semester.programme_id;
    const checkAcademicId = validatedData.academic_id || semester.academic_id;
    const checkSemesterNumber = validatedData.semester_number || semester.semester_number;

    const existingSemester = await db.semester.findOne({
      where: {
        programme_id: checkProgrammId,
        academic_id: checkAcademicId,
        semester_number: checkSemesterNumber,
        semester_id: { [db.Sequelize.Op.ne]: semester_id },
      },
    });

    if (existingSemester) {
      throw { status: 400, message: `Semester ${checkSemesterNumber} already exists for this programme and academic year` };
    }
  }

  if (validatedData.is_active === true) {
    const targetProgrammId = validatedData.programme_id || semester.programme_id;
    await db.semester.update(
      { is_active: false },
      {
        where: {
          programme_id: targetProgrammId,
          semester_id: { [db.Sequelize.Op.ne]: semester_id },
        },
      }
    );
  }

  await semester.update(validatedData);

  const updatedProgramme = await db.programme.findByPk(semester.programme_id, {
    paranoid: false,
    attributes: ['programme_name'],
  });
  const updatedAcademicYear = await db.academic_year.findByPk(semester.academic_id, {
    paranoid: false,
    attributes: ['academic_name'],
  });
  let updatedBranch = null;
  if (semester.branch_id) {
    updatedBranch = await db.branch.findByPk(semester.branch_id, { paranoid: false, attributes: ['branch_name'] });
  }
  let updatedScheme = null;
  if (semester.scheme_id) {
    updatedScheme = await db.scheme.findByPk(semester.scheme_id, { paranoid: false, attributes: ['scheme_name'] });
  }

  return {
    ...semester.toJSON(),
    programme_name: updatedProgramme ? updatedProgramme.programme_name : null,
    academic_name: updatedAcademicYear ? updatedAcademicYear.academic_name : null,
    branch_name: updatedBranch ? updatedBranch.branch_name : null,
    scheme_name: updatedScheme ? updatedScheme.scheme_name : null,
  };
};

const updateSemesterStatus = async (semester_id, is_active) => {
  const semester = await db.semester.findByPk(semester_id);

  if (!semester) {
    throw { status: 404, message: 'Semester not found' };
  }

  if (is_active === true) {
    await db.semester.update(
      { is_active: false },
      {
        where: {
          programme_id: semester.programme_id,
          semester_id: { [db.Sequelize.Op.ne]: semester_id },
        },
      }
    );
  }

  await semester.update({ is_active });

  return semester;
};

const deleteSemester = async (semester_id) => {
  const semester = await db.semester.findByPk(semester_id);

  if (!semester) {
    throw { status: 404, message: 'Semester not found' };
  }

  await semester.destroy();
  return { message: 'Semester deleted successfully' };
};

const getDeletedSemesters = async (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM semester
    WHERE deleted_at IS NOT NULL
  `;
  
  const countResult = await db.sequelize.query(countQuery, {
    type: db.sequelize.QueryTypes.SELECT,
  });
  const count = parseInt(countResult[0].total, 10);

  const query = `
    SELECT 
      s.*,
      p.programme_name, p.programme_code,
      b.branch_name,
      sch.scheme_name,
      ay.academic_name, ay.current_ay
    FROM semester s
    LEFT JOIN programme p ON s.programme_id = p.programm_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    LEFT JOIN academic_year ay ON s.academic_id = ay.academic_id
    WHERE s.deleted_at IS NOT NULL
    ORDER BY s.deleted_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const semestersWithDetails = await db.sequelize.query(query, {
    replacements: { limit: limitNum, offset },
    type: db.sequelize.QueryTypes.SELECT,
  });

  return {
    total: count,
    page: pageNum,
    totalPages: Math.ceil(count / limitNum),
    data: semestersWithDetails,
  };
};

const restoreSemester = async (semester_id) => {
  const semester = await db.semester.findByPk(semester_id, {
    paranoid: false,
  });

  if (!semester) {
    throw { status: 404, message: 'Semester not found' };
  }

  if (!semester.deleted_at) {
    throw { status: 400, message: 'Semester is not deleted' };
  }

  await semester.restore();
  return { message: 'Semester restored successfully' };
};

const permanentDeleteSemester = async (semester_id) => {
  const semester = await db.semester.findByPk(semester_id, {
    paranoid: false,
  });

  if (!semester) {
    throw { status: 404, message: 'Semester not found' };
  }

  await semester.destroy({ force: true });
  return { message: 'Semester permanently deleted successfully' };
};

const getSemesterDropdown = async (programme_id) => {
  let query = `
    SELECT 
      s.semester_id, s.semester_number, s.term_type, s.programme_id, s.academic_id, s.is_active,
      p.programme_name, p.programme_code,
      b.branch_name,
      sch.scheme_name,
      ay.academic_name, ay.current_ay
    FROM semester s
    LEFT JOIN programme p ON s.programme_id = p.programm_id
    LEFT JOIN branch b ON s.branch_id = b.branch_id
    LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
    LEFT JOIN academic_year ay ON s.academic_id = ay.academic_id
    WHERE s.deleted_at IS NULL
  `;
  const replacements = {};

  if (programme_id) {
    query += ` AND s.programme_id = :programme_id`;
    replacements.programme_id = programme_id;
  }

  query += ` ORDER BY s.semester_number ASC`;

  const semesters = await db.sequelize.query(query, {
    replacements,
    type: db.sequelize.QueryTypes.SELECT,
  });

  const semestersByProgramme = {};
  for (const semester of semesters) {
    if (!semestersByProgramme[semester.programme_id]) {
      semestersByProgramme[semester.programme_id] = [];
    }
    semestersByProgramme[semester.programme_id].push(semester);
  }

  return {
    data: semesters,
    groupedByProgramme: semestersByProgramme,
  };
};

module.exports = {
  getAllSemesters,
  getSemesterById,
  getSemestersByProgramme,
  getSemestersByAcademicYear,
  createSemester,
  updateSemester,
  updateSemesterStatus,
  deleteSemester,
  getDeletedSemesters,
  restoreSemester,
  permanentDeleteSemester,
  getSemesterDropdown,
};
