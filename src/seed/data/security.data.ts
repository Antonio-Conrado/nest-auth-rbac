import { ValidPermissions } from 'src/common/data/valid-permissions';
import { ValidRoles } from 'src/common/data/valid-roles';

// ---------------------
// Permissions list
// ---------------------
export const PermissionsData = Object.values(ValidPermissions).map((name) => ({
  name,
  status: true,
}));

// ---------------------
// Roles with permission
// ---------------------
export const RolesData = [
  {
    name: ValidRoles.admin,
    status: true,
    // Only the admin full access permission is needed
    permissions: [ValidPermissions.adminFullAccess],
  },
  {
    name: ValidRoles.user,
    status: true,
    permissions: [
      // Users
      ValidPermissions.usersFindAll,
      ValidPermissions.userFindOne,
      ValidPermissions.userUpdate,
      ValidPermissions.userChangePassword,

      // Roles
      ValidPermissions.rolesFindAll,
      ValidPermissions.roleFindOne,

      // Permissions
      ValidPermissions.permissionsFindAll,
      ValidPermissions.permissionFindOne,
    ],
  },
];

// ---------------------
// Users have plain text passwords defined in the data file, which are then encrypted (hashed) in the seed service right before saving to the database.
// ---------------------
const createEmptySecurity = () => ({
  confirmationToken: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  rememberToken: null,
  rememberTokenExpires: null,
});

export const UsersData = [
  {
    name: 'Juan',
    surname: 'Pérez',
    email: 'admin@correo.com',
    password: '123456',
    telephone: '+50588889999',
    profilePhotoUrl: null,
    isAccountConfirmed: true,
    status: true,
    role: ValidRoles.admin,
    security: createEmptySecurity(),
  },
  {
    name: 'Ana',
    surname: 'García',
    email: 'correo@correo.com',
    password: '123456',
    telephone: '+50577776666',
    profilePhotoUrl: null,
    isAccountConfirmed: true,
    status: true,
    role: ValidRoles.user,
    security: createEmptySecurity(),
  },
];
