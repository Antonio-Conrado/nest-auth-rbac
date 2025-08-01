export const ValidPermissions = {
  adminFullAccess: 'acceso completo administrador',

  // Usuarios
  usersFindAll: 'obtener todos los usuarios',
  userFindOne: 'obtener un usuario',
  userCreate: 'crear usuario',
  userUpdate: 'editar usuario',
  userChangePassword: 'cambiar contraseña usuario',
  userToggleStatus: 'activar o suspender usuario',

  // Roles
  rolesFindAll: 'obtener todos los roles',
  roleFindOne: 'obtener un rol',
  roleCreate: 'crear rol',
  roleUpdate: 'editar rol',
  roleToggleStatus: 'activar o suspender rol',
  roleAssignPermissions: 'asignar permisos a rol',

  // Permisos
  permissionsFindAll: 'obtener todos los permisos',
  permissionFindOne: 'obtener un permiso',
  permissionCreate: 'crear permiso',
  permissionUpdate: 'editar permiso',
  permissionToggleStatus: 'activar o suspender permiso',
} as const;
