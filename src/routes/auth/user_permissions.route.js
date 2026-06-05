const express = require('express');
const {
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
} = require('../../controllers/auth/user_permissions.controller.js');
const { verifyToken } = require('../../middlewares/auth.middleware.js');

const router = express.Router();

router.use(verifyToken);

router.get('/permission/dropdown', dropdownPermissions);
router.post('/permission/bulk', addPermissionBulk);
router.post('/permission', addPermission);
router.get('/permission', listPermissions);
router.delete('/permission/:id', removePermission);

router.post('/role-permission/delete-bulk', removeRolePermissionBulk);
router.post('/role-permission/bulk', addRolePermissionBulk);
router.post('/role-permission', addRolePermission);
router.get('/role-permission', listRolePermissions);
router.delete('/role-permission/:utid/:code', removeRolePermission);

module.exports = router;
