const db = require('../../../models');
const {
  buildDepartmentWhere,
  assertDepartmentAccess,
  assertInstitutionAccess,
} = require('../../helpers/scope.helper.js');

const getAllBranches = async (scope = null) => {
  const { clause, replacements } = buildDepartmentWhere(scope, 'd');
  const whereParts = ['b.deletedAt IS NULL'];
  if (clause) whereParts.push(clause);

  const branches = await db.sequelize.query(
    `
      SELECT 
        b.*,
        p.programme_name, p.programme_code,
        d.depart_name, d.depart_code
      FROM branch b
      LEFT JOIN programme p ON b.programm_id = p.programm_id AND p.deletedAt IS NULL
      LEFT JOIN department d ON b.depart_id = d.depart_id
      WHERE ${whereParts.join(' AND ')}
      ORDER BY b.createdAt DESC
    `,
    {
      replacements,
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return branches;
};

const getBranchById = async (branch_id) => {
  const [branch] = await db.sequelize.query(
    `
      SELECT 
        b.*,
        p.programme_name, p.programme_code,
        d.depart_name, d.depart_code
      FROM branch b
      LEFT JOIN programme p ON b.programm_id = p.programm_id AND p.deletedAt IS NULL
      LEFT JOIN department d ON b.depart_id = d.depart_id
      WHERE b.branch_id = :branch_id AND b.deletedAt IS NULL
    `,
    {
      replacements: { branch_id },
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!branch) {
    throw { status: 404, message: 'Branch not found' };
  }

  return branch;
};

const getBranchesByProgramme = async (id) => {
  const programme = await db.programme.findByPk(id);
  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  const branches = await db.branch.findAll({
    where: { programm_id: id },
    order: [['branch_name', 'ASC']],
  });

  return { branches, programme_name: programme.programme_name };
};

const getBranchesByDepartment = async (id) => {
  const department = await db.department.findByPk(id);
  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  const branches = await db.branch.findAll({
    where: { depart_id: id },
    order: [['branch_name', 'ASC']],
  });

  return { branches, depart_name: department.depart_name };
};

const createBranch = async (data) => {
  const programme = await db.programme.findByPk(data.programm_id);
  if (!programme) {
    throw { status: 404, message: 'Programme not found. Please select a valid programme.' };
  }

  const department = await db.department.findByPk(data.depart_id);
  if (!department) {
    throw { status: 404, message: 'Department not found. Please select a valid department.' };
  }

  const existingBranch = await db.branch.findOne({
    where: {
      branch_name: data.branch_name,
      programm_id: data.programm_id,
    },
  });

  if (existingBranch) {
    throw { status: 400, message: 'Branch with this name already exists in the selected programme' };
  }

  const branch = await db.branch.create(data);

  return {
    ...branch.toJSON(),
    programme_name: programme.programme_name,
    depart_name: department.depart_name,
  };
};

const updateBranch = async (branch_id, data) => {
  const branch = await db.branch.findByPk(branch_id);

  if (!branch) {
    throw { status: 404, message: 'Branch not found' };
  }

  if (data.programm_id) {
    const programme = await db.programme.findByPk(data.programm_id);
    if (!programme) {
      throw { status: 404, message: 'New programme not found. Please select a valid programme.' };
    }
  }

  if (data.depart_id) {
    const department = await db.department.findByPk(data.depart_id);
    if (!department) {
      throw { status: 404, message: 'New department not found. Please select a valid department.' };
    }
  }

  if (data.branch_name) {
    const programmId = data.programm_id || branch.programm_id;
    const existingBranch = await db.branch.findOne({
      where: {
        branch_name: data.branch_name,
        programm_id: programmId,
        branch_id: { [db.Sequelize.Op.ne]: branch_id },
      },
    });

    if (existingBranch) {
      throw { status: 400, message: 'Branch with this name already exists in the programme' };
    }
  }

  await branch.update(data);

  const programme = await db.programme.findByPk(branch.programm_id);
  const department = await db.department.findByPk(branch.depart_id);

  return {
    ...branch.toJSON(),
    programme_name: programme ? programme.programme_name : null,
    depart_name: department ? department.depart_name : null,
  };
};

const deleteBranch = async (branch_id) => {
  const branch = await db.branch.findByPk(branch_id);

  if (!branch) {
    throw { status: 404, message: 'Branch not found' };
  }

  await branch.destroy();
  return { message: 'Branch deleted successfully' };
};

const permanentDeleteBranch = async (branch_id) => {
  const branch = await db.branch.findByPk(branch_id, {
    paranoid: false,
  });

  if (!branch) {
    throw { status: 404, message: 'Branch not found' };
  }

  // There is no child model in branch, it is safe to force delete
  await branch.destroy({ force: true });
  return { message: 'Branch permanently deleted successfully' };
};

const checkProgrammeBranches = async (id) => {
  const programme = await db.programme.findByPk(id);
  if (!programme) {
    throw { status: 404, message: 'Programme not found' };
  }

  const branches = await db.branch.findAll({
    where: { programm_id: id },
  });

  if (branches.length > 0) {
    return {
      hasBranches: true,
      branchCount: branches.length,
      branches: branches,
      warning: `This programme has ${branches.length} branch(es). Deleting this programme will affect these branches.`,
      message: `Programme has associated branches`,
    };
  } else {
    return {
      hasBranches: false,
      branchCount: 0,
      message: 'Programme has no associated branches',
    };
  }
};

const getBranchesDropdown = async () => {
  const branches = await db.branch.findAll({
    where: { status: true },
    attributes: [
      'branch_id',
      'branch_name',
      'branch_code',
      'programm_id',
      'depart_id',
    ],
    order: [['branch_name', 'ASC']],
  });

  const branchesByProgramme = {};
  for (const branch of branches) {
    if (!branchesByProgramme[branch.programm_id]) {
      branchesByProgramme[branch.programm_id] = [];
    }
    branchesByProgramme[branch.programm_id].push(branch);
  }

  return { branches, groupedByProgramme: branchesByProgramme };
};

const getDeletedBranch = async () => {
  const branches = await db.sequelize.query(
    `
      SELECT 
        b.*,
        p.programme_name, p.programme_code,
        d.depart_name, d.depart_code
      FROM branch b
      LEFT JOIN programme p ON b.programm_id = p.programm_id
      LEFT JOIN department d ON b.depart_id = d.depart_id
      WHERE b.deletedAt IS NOT NULL
      ORDER BY b.deletedAt DESC
    `,
    {
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return branches;
};

const restoreBranch = async (branch_id) => {
  const branch = await db.branch.findByPk(branch_id, {
    paranoid: false,
  });

  if (!branch) {
    throw { status: 404, message: 'Branch not found in records' };
  }

  if (!branch.deletedAt) {
    throw { status: 400, message: 'Branch is already Active' };
  }

  await branch.restore();
  return { message: 'Branch restored successfully' };
};

module.exports = {
  getAllBranches,
  getBranchById,
  getBranchesByProgramme,
  getBranchesByDepartment,
  createBranch,
  updateBranch,
  deleteBranch,
  permanentDeleteBranch,
  checkProgrammeBranches,
  getBranchesDropdown,
  getDeletedBranch,
  restoreBranch,
};
