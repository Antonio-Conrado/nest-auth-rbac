// The values in ValidPermissions must match the `name` field in the Permission table and stay synchronized with PermissionsDataSeed.

export const ValidPermissions = {
  superAdminFullAccess: 'super.admin.fullAccess',

  // Users
  usersRead: 'users.read',
  userReadOne: 'user.readOne',
  userCreate: 'user.create',
  userUpdate: 'user.update',
  userChangePassword: 'user.changePassword',
  userToggleStatus: 'user.toggleStatus',
  userUploadImage: 'user.uploadImage',

  // Roles
  rolesRead: 'roles.read',
  roleReadOne: 'role.readOne',
  roleCreate: 'role.create',
  roleUpdate: 'role.update',
  roleToggleStatus: 'role.toggleStatus',
  roleAssignPermissions: 'role.assignPermissions',

  // Permissions
  permissionsRead: 'permissions.read',
  permissionReadOne: 'permission.readOne',
  permissionCreate: 'permission.create',
  permissionUpdate: 'permission.update',
  permissionToggleStatus: 'permission.toggleStatus',
} as const;
