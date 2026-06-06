const crypto = require('crypto');
const db = require('../../../models');

const createPermission = async (payload) => {
  const { module, action } = payload;
  const code = `${module}:${action}`;
  const id = crypto.randomUUID();
  await db.sequelize.query(
    `INSERT INTO permissions (id, module, action, code) VALUES (:id, :module, :action, :code)`,
    { replacements: { id, module, action, code } }
  );
  return { id, module, action, code };
};

const createPermissionBulk = async (payload) => {
  const { module, action, exception = [] } = payload;
  const modules = Array.isArray(module) ? module : [module];
  const actions = Array.isArray(action) ? action : [action];

  const records = [];

  // Use nested loops to create the Cartesian product (every module x every action)
  for (const m of modules) {
    for (const a of actions) {
      const code = `${m}:${a}`;
      if (exception.includes(code)) {
        continue;
      }
      records.push({
        id: crypto.randomUUID(),
        module: m,
        action: a,
        code
      });
    }
  }

  // Execute database insertion
  await db.sequelize.transaction(async (t) => {
    for (const record of records) {
      await db.sequelize.query(
        `INSERT INTO permissions (id, module, action, code) VALUES (:id, :module, :action, :code)`,
        { replacements: record, transaction: t }
      );
    }
  });

  return records;
};

const getPermissions = async () => {
  const permissions = await db.sequelize.query(
    `SELECT * FROM permissions`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );
  return permissions;
};

const getPermissionDropdown = async () => {
  const permissions = await db.sequelize.query(
    `SELECT code FROM permissions`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );
  return permissions.map(p => p.code);
};

const assignRolePermission = async (payload) => {
  const { utid, code } = payload;
  const permissions = await db.sequelize.query(
    `SELECT id FROM permissions WHERE code = :code`,
    { replacements: { code }, type: db.Sequelize.QueryTypes.SELECT }
  );

  if (!permissions || permissions.length === 0) {
    throw new Error('Permission not found');
  }

  const permission_id = permissions[0].id;
  const id = crypto.randomUUID();

  await db.sequelize.query(
    `INSERT INTO role_permissions (id, utid, permission_id) VALUES (:id, :utid, :permission_id)`,
    { replacements: { id, utid, permission_id } }
  );
  return { id, utid, code, permission_id };
};

const assignRolePermissionBulk = async (payload) => {
  const { utid, code } = payload;
  const codes = Array.isArray(code) ? code : [code];

  if (codes.length === 0) return;

  const permissions = await db.sequelize.query(
    `SELECT id, code FROM permissions WHERE code IN (:codes)`,
    { replacements: { codes }, type: db.Sequelize.QueryTypes.SELECT }
  );

  const foundCodes = permissions.map(p => p.code);
  const missingCodes = codes.filter(c => !foundCodes.includes(c));

  if (missingCodes.length > 0) {
    throw new Error(`Permissions not found for codes: ${missingCodes.join(', ')}`);
  }

  await db.sequelize.transaction(async (t) => {
    for (const permission of permissions) {
      const id = crypto.randomUUID();
      await db.sequelize.query(
        `INSERT INTO role_permissions (id, utid, permission_id) VALUES (:id, :utid, :permission_id)`,
        { replacements: { id, utid, permission_id: permission.id }, transaction: t }
      );
    }
  });
};

const getRolePermissions = async () => {
  const rolePermissions = await db.sequelize.query(
    `SELECT rp.id, rp.utid, rp.permission_id, p.code 
     FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.id`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );
  return rolePermissions;
};

const deleteRolePermission = async (payload) => {
  const { utid, code } = payload;
  let query = `DELETE rp FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE p.code = :code`;
  let replacements = { code };
  if (utid !== undefined) {
    query += ` AND rp.utid = :utid`;
    replacements.utid = utid;
  }
  await db.sequelize.query(query, { replacements });
};

const deleteRolePermissionBulk = async (payload) => {
  const { utid, code } = payload;
  const codes = Array.isArray(code) ? code : [code];
  if (codes.length === 0) return;

  let query = `DELETE rp FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE p.code IN (:codes)`;
  let replacements = { codes };
  if (utid !== undefined) {
    query += ` AND rp.utid = :utid`;
    replacements.utid = utid;
  }
  await db.sequelize.query(query, { replacements });
};

const deletePermission = async (id) => {
  await db.sequelize.query(
    `DELETE FROM permissions WHERE id = :id`,
    { replacements: { id } }
  );
};

module.exports = {
  createPermission,
  createPermissionBulk,
  getPermissions,
  getPermissionDropdown,
  assignRolePermission,
  assignRolePermissionBulk,
  getRolePermissions,
  deleteRolePermission,
  deleteRolePermissionBulk,
  deletePermission,
};
