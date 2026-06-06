const db = require('../../../models');
const {
  buildProgrammeScopeClause,
  assertInstitutionAccess,
  assertDepartmentAccess,
  enforceInstitutionId,
} = require('../../helpers/scope.helper.js');

const getAllProgrammes = async (scope = null) => {
  const { clause, replacements } = buildProgrammeScopeClause(scope, 'p');
  const whereParts = ['p.deletedAt IS NULL'];
  if (clause) whereParts.push(clause);

  const programmes = await db.sequelize.query(
    `
      SELECT 
        p.*,
        d.depart_name, d.depart_code,
        i.name AS institution_name, i.institution_type AS institution_type
      FROM programme p
      LEFT JOIN department d ON p.depart_id = d.depart_id
      LEFT JOIN institution i ON p.institution_id = i.institution_id
      WHERE ${whereParts.join(' AND ')}
      ORDER BY p.createdAt DESC
    `,
    {
      replacements,
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return programmes;
};

const getProgrammeById = async (programm_id, scope = null) => {
  const [programme] = await db.sequelize.query(
    `
      SELECT 
        p.*,
        d.depart_name, d.depart_code,
        i.name AS institution_name, i.institution_type AS institution_type
      FROM programme p
      LEFT JOIN department d ON p.depart_id = d.depart_id
      LEFT JOIN institution i ON p.institution_id = i.institution_id
      WHERE p.programm_id = :programm_id AND p.deletedAt IS NULL
    `,
    {
      replacements: { programm_id },
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  assertInstitutionAccess(scope, programme.institution_id);
  assertDepartmentAccess(scope, programme.depart_id);

  return programme;
};

const getProgrammesByDepartment = async (id, scope = null) => {
  assertDepartmentAccess(scope, id);
  const department = await db.department.findByPk(id);
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  const programmes = await db.programme.findAll({
    where: { depart_id: id },
    order: [['programme_name', 'ASC']],
  });

  return { programmes, depart_name: department.depart_name };
};

const getProgrammesByInstitution = async (id, scope = null) => {
  const institutionId = enforceInstitutionId(scope, id);
  const institution = await db.institution.findByPk(institutionId);
  if (!institution) {
    throw { status: 404, message: 'Institution not found' };
  }

  const programmes = await db.programme.findAll({
    where: { institution_id: institutionId },
    order: [['programme_name', 'ASC']],
  });

  return { programmes, institution_name: institution.name };
};

const createProgramme = async (data, scope = null) => {
  data.institution_id = enforceInstitutionId(scope, data.institution_id);
  if (data.depart_id) {
    assertDepartmentAccess(scope, data.depart_id);
  }
  const institution = await db.institution.findByPk(data.institution_id);
  if (!institution) {
    throw { status: 404, message: 'Institution not found. Please select a valid institution.' };
  }

  const department = await db.department.findByPk(data.depart_id);
  if (!department) {
    throw { status: 404, message: 'Department not found. Please select a valid department.' };
  }

  const existingProgramme = await db.programme.findOne({
    where: {
      programme_name: data.programme_name,
      depart_id: data.depart_id,
    },
  });

  if (existingProgramme) {
    throw { status: 400, message: 'Programme with this name already exists in the selected department' };
  }

  const programme = await db.programme.create(data);

  return {
    ...programme.toJSON(),
    institution_name: institution.name,
    depart_name: department.depart_name,
  };
};

const updateProgramme = async (programm_id, data, scope = null) => {
  const programme = await db.programme.findByPk(programm_id);

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  assertInstitutionAccess(scope, programme.institution_id);
  assertDepartmentAccess(scope, programme.depart_id);

  if (data.institution_id) {
    data.institution_id = enforceInstitutionId(scope, data.institution_id);
    const institution = await db.institution.findByPk(data.institution_id);
    if (!institution) {
      throw { status: 404, message: 'New institution not found. Please select a valid institution.' };
    }
  }

  if (data.depart_id) {
    assertDepartmentAccess(scope, data.depart_id);
    const department = await db.department.findByPk(data.depart_id);
    if (!department) {
      throw { status: 404, message: 'New department not found. Please select a valid department.' };
    }
  }

  if (data.programme_name) {
    const departId = data.depart_id || programme.depart_id;
    const existingProgramme = await db.programme.findOne({
      where: {
        programme_name: data.programme_name,
        depart_id: departId,
        programm_id: { [db.Sequelize.Op.ne]: programm_id },
      },
    });

    if (existingProgramme) {
      throw { status: 400, message: 'Programme with this name already exists in the department' };
    }
  }

  await programme.update(data);

  const institution = await db.institution.findByPk(programme.institution_id);
  const department = await db.department.findByPk(programme.depart_id);

  return {
    ...programme.toJSON(),
    institution_name: institution ? institution.name : null,
    depart_name: department ? department.depart_name : null,
  };
};

const deleteProgramme = async (programm_id, scope = null) => {
  const programme = await db.programme.findByPk(programm_id);

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  assertInstitutionAccess(scope, programme.institution_id);
  assertDepartmentAccess(scope, programme.depart_id);

  await programme.destroy();
  return { message: 'Programme deleted successfully' };
};

const permanentDeleteProgramme = async (programm_id) => {
  const programme = await db.programme.findByPk(programm_id, {
    paranoid: false,
  });

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  // Check if branches exist before allowing hard delete
  const associatedBranches = await db.branch.findAll({
    where: { programm_id: programm_id },
    paranoid: false,
  });

  if (associatedBranches.length > 0) {
    throw {
      status: 400,
      message: `Cannot permanently delete programme. It still has ${associatedBranches.length} associated branch(es). Please permanently delete or reassign them first.`,
    };
  }

  // If no branches exist, it is safe to force delete
  await programme.destroy({ force: true });
  return { message: 'Programme permanently deleted successfully' };
};

const checkDepartmentProgrammes = async (id) => {
  const department = await db.department.findByPk(id);
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  const programmes = await db.programme.findAll({
    where: { depart_id: id },
  });

  if (programmes.length > 0) {
    return {
      hasProgrammes: true,
      programmeCount: programmes.length,
      programmes: programmes,
      warning: `This department has ${programmes.length} programme(s). Deleting this department will affect these programmes.`,
      message: `Department has associated programmes`,
    };
  } else {
    return {
      hasProgrammes: false,
      programmeCount: 0,
      message: 'Department has no associated programmes',
    };
  }
};

const getProgrammesDropdown = async () => {
  const programmes = await db.programme.findAll({
    where: { status: true },
    attributes: [
      'programm_id',
      'programme_name',
      'programme_code',
      'depart_id',
      'institution_id',
    ],
    order: [['programme_name', 'ASC']],
  });

  const programmesByDepartment = {};
  for (const prog of programmes) {
    if (!programmesByDepartment[prog.depart_id]) {
      programmesByDepartment[prog.depart_id] = [];
    }
    programmesByDepartment[prog.depart_id].push(prog);
  }

  return { programmes, groupedByDepartment: programmesByDepartment };
};

const getDeletedProgramme = async () => {
  const programmes = await db.sequelize.query(
    `
      SELECT 
        p.*,
        d.depart_name, d.depart_code,
        i.name AS institution_name, i.institution_type AS institution_type
      FROM programme p
      LEFT JOIN department d ON p.depart_id = d.depart_id
      LEFT JOIN institution i ON p.institution_id = i.institution_id
      WHERE p.deletedAt IS NOT NULL
      ORDER BY p.deletedAt DESC
    `,
    {
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return programmes;
};

const restoreProgramme = async (programm_id) => {
  const programme = await db.programme.findByPk(programm_id, {
    paranoid: false,
  });

  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  if (!programme.deletedAt) {
    throw { status: 400, message: 'Programme is not deleted' };
  }

  await programme.restore();
  return { message: 'Programme restored successfully' };
};

module.exports = {
  getAllProgrammes,
  getProgrammeById,
  getProgrammesByDepartment,
  getProgrammesByInstitution,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  permanentDeleteProgramme,
  checkDepartmentProgrammes,
  getProgrammesDropdown,
  getDeletedProgramme,
  restoreProgramme,
};
