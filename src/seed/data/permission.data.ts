import { ValidPermissions } from 'src/common/data/valid-permissions';

// ---------------------
// Permissions for seeding
// ---------------------
export const PermissionsDataSeed = [
  //Super Admin
  {
    name: ValidPermissions.superAdminFullAccess,
    description: 'Acceso completo Super Administrador',
    status: true,
  },

  // Users
  {
    name: ValidPermissions.usersRead,
    description: 'Ver todos los usuarios',
    status: true,
  },
  {
    name: ValidPermissions.userReadOne,
    description: 'Ver usuario',
    status: true,
  },
  {
    name: ValidPermissions.userCreate,
    description: 'Crear usuario',
    status: true,
  },
  {
    name: ValidPermissions.userUpdate,
    description: 'Editar usuario',
    status: true,
  },
  {
    name: ValidPermissions.userChangePassword,
    description: 'Cambiar contraseña usuario',
    status: true,
  },
  {
    name: ValidPermissions.userToggleStatus,
    description: 'Activar / suspender usuario',
    status: true,
  },
  {
    name: ValidPermissions.userUploadImage,
    description: 'Subir imagen de usuario',
    status: true,
  },

  // Roles
  {
    name: ValidPermissions.rolesRead,
    description: 'Ver todos los roles',
    status: true,
  },
  { name: ValidPermissions.roleReadOne, description: 'Ver rol', status: true },
  { name: ValidPermissions.roleCreate, description: 'Crear rol', status: true },
  {
    name: ValidPermissions.roleUpdate,
    description: 'Editar rol',
    status: true,
  },
  {
    name: ValidPermissions.roleToggleStatus,
    description: 'Activar / suspender rol',
    status: true,
  },
  {
    name: ValidPermissions.roleAssignPermissions,
    description: 'Asignar permisos a rol',
    status: true,
  },

  // Permissions
  {
    name: ValidPermissions.permissionsRead,
    description: 'Ver todos los permisos',
    status: true,
  },
  {
    name: ValidPermissions.permissionReadOne,
    description: 'Ver permiso',
    status: true,
  },
  {
    name: ValidPermissions.permissionCreate,
    description: 'Crear permiso',
    status: true,
  },
  {
    name: ValidPermissions.permissionUpdate,
    description: 'Editar permiso',
    status: true,
  },
  {
    name: ValidPermissions.permissionToggleStatus,
    description: 'Activar / suspender permiso',
    status: true,
  },
];
