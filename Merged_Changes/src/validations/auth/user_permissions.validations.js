const { z } = require('zod');

const createPermissionSchema = z.object({
  module: z.string({ required_error: 'Module is required' }).max(50),
  action: z.string({ required_error: 'Action is required' }).max(50),
});

const assignRolePermissionSchema = z.object({
  utid: z.number({ required_error: 'User Type ID (utid) is required' }),
  code: z.string({ required_error: 'Valid Permission Code is required' }),
});

const createPermissionBulkSchema = z.object({
  module: z.union([z.string(), z.array(z.string())]),
  action: z.union([z.string(), z.array(z.string())]),
  exception: z.array(z.string()).optional(),
});

const assignRolePermissionBulkSchema = z.object({
  utid: z.number({ required_error: 'User Type ID (utid) is required' }),
  code: z.union([z.string(), z.array(z.string())]),
});

const deleteRolePermissionBulkSchema = z.object({
  utid: z.number().optional(),
  code: z.union([z.string(), z.array(z.string())]),
});

module.exports = { 
  createPermissionSchema, 
  assignRolePermissionSchema, 
  createPermissionBulkSchema, 
  assignRolePermissionBulkSchema,
  deleteRolePermissionBulkSchema
};
