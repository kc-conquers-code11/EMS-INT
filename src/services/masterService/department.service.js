const db = require('../../../models');
const departmentSetupService = require('./departmentSetup.service.js');
const {
  buildDepartmentWhere,
  assertInstitutionAccess,
  assertDepartmentAccess,
  enforceInstitutionId,
  assertDepartmentInScope,
} = require('../../helpers/scope.helper.js');

const activeDepartmentFilter = { is_deleted: false };

const getAllDepartments = async (scope = null) => {
  const { clause, replacements } = buildDepartmentWhere(scope);
  const whereParts = ['d.deletedAt IS NULL', '(d.is_deleted = 0 OR d.is_deleted IS NULL)'];
  if (clause) whereParts.push(clause);

  const departments = await db.sequelize.query(
    `SELECT d.* FROM department d
     WHERE ${whereParts.join(' AND ')}
     ORDER BY d.depart_name ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const departmentsWithInstitutions = await Promise.all(
    departments.map(async (dept) => {
      const institution = await db.institution.findByPk(dept.institution_id);
      return {
        ...dept,
        institution_name: institution ? institution.name : null,
        institution_details: institution,
      };
    })
  );

  return departmentsWithInstitutions;
};

const getDepartmentById = async (depart_id, scope = null) => {
  await assertDepartmentInScope(scope, depart_id);
  const department = await db.department.findOne({
    where: { depart_id, ...activeDepartmentFilter },
  });

  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  const institution = await db.institution.findByPk(department.institution_id);

  return {
    ...department.toJSON(),
    institution_name: institution ? institution.name : null,
    institution_details: institution,
  };
};

const getDepartmentsByInstitution = async (id, scope = null) => {
  const institutionId = enforceInstitutionId(scope, id);
  const institution = await db.institution.findByPk(institutionId);
  if (!institution) {
    throw { status: 404, message: 'Institution not found' };
  }

  const departments = await db.department.findAll({
    where: { institution_id: institutionId, ...activeDepartmentFilter },
    order: [['depart_name', 'ASC']],
  });

  return { departments, institution_name: institution.name };
};

const createDepartment = async (data, scope = null) => {
  data.institution_id = enforceInstitutionId(scope, data.institution_id);
  const institution = await db.institution.findByPk(data.institution_id);
  if (!institution) {
    throw { status: 404, message: 'Institution not found. Please select a valid institution.' };
  }

  const existingDepartment = await db.department.findOne({
    where: {
      depart_name: data.depart_name,
      institution_id: data.institution_id,
    },
  });

  if (existingDepartment) {
    throw { status: 400, message: 'Department with this name already exists in the selected institution' };
  }

  const department = await db.department.create(data);

  return {
    ...department.toJSON(),
    institution_name: institution.name,
  };
};

const updateDepartment = async (depart_id, data, scope = null) => {
  await assertDepartmentInScope(scope, depart_id);
  const department = await db.department.findByPk(depart_id);

  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  if (data.institution_id) {
    data.institution_id = enforceInstitutionId(scope, data.institution_id);
    const institution = await db.institution.findByPk(data.institution_id);
    if (!institution) {
      throw { status: 404, message: 'New institution not found. Please select a valid institution.' };
    }
  }

  if (data.depart_name) {
    const institutionId = data.institution_id || department.institution_id;
    const existingDepartment = await db.department.findOne({
      where: {
        depart_name: data.depart_name,
        institution_id: institutionId,
        depart_id: { [db.Sequelize.Op.ne]: depart_id },
      },
    });

    if (existingDepartment) {
      throw { status: 400, message: 'Department with this name already exists in the institution' };
    }
  }

  await department.update(data);

  const institution = await db.institution.findByPk(department.institution_id);

  return {
    ...department.toJSON(),
    institution_name: institution ? institution.name : null,
  };
};

const deleteDepartment = async (depart_id, deletedBy, scope = null) => {
  await assertDepartmentInScope(scope, depart_id);
  return departmentSetupService.softDeleteDepartmentSetup(depart_id, deletedBy);
};

const permanentDeleteDepartment = async (depart_id, scope = null) => {
  await assertDepartmentInScope(scope, depart_id);
  const department = await db.department.findByPk(depart_id);

  if (!department) {
    throw { status: 404, message: 'Department not found' };
  }

  await department.destroy();
  return { message: 'Department permanently deleted successfully' };
};

const checkInstitutionDepartments = async (id, scope = null) => {
  const institutionId = enforceInstitutionId(scope, id);
  const institution = await db.institution.findByPk(institutionId);
  if (!institution) {
    throw { status: 404, message: 'Institution not found' };
  }

  const departments = await db.department.findAll({
    where: { institution_id: institutionId },
  });

  if (departments.length > 0) {
    return {
      hasDepartments: true,
      departmentCount: departments.length,
      departments: departments,
      warning: `This institution has ${departments.length} department(s). Deleting this institution will affect these departments.`,
      message: `Institution has associated departments`,
    };
  } else {
    return {
      hasDepartments: false,
      departmentCount: 0,
      message: 'Institution has no associated departments',
    };
  }
};

const getDepartmentsDropdown = async (scope = null) => {
  const { clause, replacements } = buildDepartmentWhere(scope);
  const whereParts = ['d.status = 1', 'd.deletedAt IS NULL', '(d.is_deleted = 0 OR d.is_deleted IS NULL)'];
  if (clause) whereParts.push(clause);

  const departments = await db.sequelize.query(
    `SELECT d.depart_id, d.depart_name, d.depart_code, d.institution_id
     FROM department d
     WHERE ${whereParts.join(' AND ')}
     ORDER BY d.depart_name ASC`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const departmentsByInstitution = {};
  for (const dept of departments) {
    if (!departmentsByInstitution[dept.institution_id]) {
      departmentsByInstitution[dept.institution_id] = [];
    }
    departmentsByInstitution[dept.institution_id].push(dept);
  }

  return { departments, groupedByInstitution: departmentsByInstitution };
};

const getDepartList = async (scope = null) => {
  const { clause, replacements } = buildDepartmentWhere(scope, 'd');
  const whereParts = ['d.deletedAt IS NULL', '(d.is_deleted = 0 OR d.is_deleted IS NULL)'];
  if (clause) whereParts.push(clause);

  const query = `
    SELECT 
      d.depart_id,
      d.depart_name, 
      h.name AS head_name, 
      d.total_faculties, 
      d.total_students, 
      h.phone_number AS contact, 
      h.email 
    FROM department d 
    LEFT JOIN hod h ON d.hod_id = h.hod_id AND h.is_deleted = 0 AND h.deletedAt IS NULL
    WHERE ${whereParts.join(' AND ')}
    ORDER BY d.depart_name ASC
  `;
  const results = await db.sequelize.query(query, {
    replacements,
    type: db.Sequelize.QueryTypes.SELECT,
  });
  return results;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByInstitution,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  permanentDeleteDepartment,
  checkInstitutionDepartments,
  getDepartmentsDropdown,
  getDepartList,
};
