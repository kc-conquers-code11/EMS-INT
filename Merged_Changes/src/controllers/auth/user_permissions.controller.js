const { createPermissionSchema, assignRolePermissionSchema, createPermissionBulkSchema, assignRolePermissionBulkSchema } = require('../../validations/auth/user_permissions.validations.js');
const { ZodError } = require('zod');
const {
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
} = require('../../services/auth/user_permissions.service.js');
const { deleteRolePermissionBulkSchema } = require('../../validations/auth/user_permissions.validations.js');

const addPermission = async (req, res) => {
  try {
    const validated = createPermissionSchema.parse(req.body);
    const result = await createPermission(validated);
    return res.status(201).json({ success: true, data: result, message: 'Permission created successfully' });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, errors: error.issues });
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const addPermissionBulk = async (req, res) => {
  try {
    const validated = createPermissionBulkSchema.parse(req.body);
    const result = await createPermissionBulk(validated);
    return res.status(201).json({ success: true, data: result, message: 'Permissions created successfully in bulk' });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, errors: error.issues });
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const listPermissions = async (req, res) => {
  try {
    const result = await getPermissions();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const dropdownPermissions = async (req, res) => {
  try {
    const result = await getPermissionDropdown();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const addRolePermission = async (req, res) => {
  try {
    const validated = assignRolePermissionSchema.parse(req.body);
    const result = await assignRolePermission(validated);
    return res.status(201).json({ success: true, data: result, message: 'Role permission assigned successfully' });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, errors: error.issues });
    if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Role permission already exists' });
    if (error.message === 'Permission not found') return res.status(404).json({ success: false, message: 'Permission not found' });
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const addRolePermissionBulk = async (req, res) => {
  try {
    const validated = assignRolePermissionBulkSchema.parse(req.body);
    const result = await assignRolePermissionBulk(validated);
    return res.status(201).json({ success: true, data: result, message: 'Role permissions assigned successfully in bulk' });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, errors: error.issues });
    if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'One or more role permissions already exist' });
    if (error.message && error.message.startsWith('Permissions not found')) return res.status(404).json({ success: false, message: error.message });
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const listRolePermissions = async (req, res) => {
  try {
    const result = await getRolePermissions();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const removeRolePermission = async (req, res) => {
  try {
    const { utid, code } = req.params;
    await deleteRolePermission({ utid: utid ? parseInt(utid) : undefined, code });
    return res.status(200).json({ success: true, message: 'Role permission deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const removeRolePermissionBulk = async (req, res) => {
  try {
    const validated = deleteRolePermissionBulkSchema.parse(req.body);
    await deleteRolePermissionBulk(validated);
    return res.status(200).json({ success: true, message: 'Role permissions deleted successfully in bulk' });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, errors: error.issues });
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const removePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePermission(id);
    return res.status(200).json({ success: true, message: 'Permission deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  addPermission,
  addPermissionBulk,
  listPermissions,
  dropdownPermissions,
  addRolePermission,
  addRolePermissionBulk,
  listRolePermissions,
  removeRolePermission,
  removeRolePermissionBulk,
  removePermission,
};
