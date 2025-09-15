import { ValidPermissions } from 'src/common/data/valid-permissions';
import { ValidRoles } from 'src/common/data/valid-roles';
import { PermissionsDataSeed } from './permission.data';

// ---------------------
// Permissions list
// ---------------------
export const PermissionsData = PermissionsDataSeed.map((permission) => ({
  name: permission.name,
  description: permission.description,
  status: true,
}));

// ---------------------
// Roles with permission
// ---------------------
export const RolesData = [
  {
    name: ValidRoles.superAdmin,
    status: true,
    permissions: [
      PermissionsDataSeed.find(
        (permission) =>
          permission.name === ValidPermissions.superAdminFullAccess,
      ),
    ],
  },
  {
    name: ValidRoles.admin,
    status: true,
    permissions: [
      // Users
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.usersRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userReadOne,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userUpdate,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userChangePassword,
      ),

      // Roles
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.rolesRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.roleReadOne,
      ),

      // Permissions
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.permissionsRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.permissionReadOne,
      ),
    ].filter(Boolean), // discard undefined if not found
  },
  {
    name: ValidRoles.user,
    status: true,
    permissions: [
      // Users
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.usersRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userReadOne,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userUpdate,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.userChangePassword,
      ),

      // Roles
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.rolesRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.roleReadOne,
      ),

      // Permissions
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.permissionsRead,
      ),
      PermissionsDataSeed.find(
        (permission) => permission.name === ValidPermissions.permissionReadOne,
      ),
    ].filter(Boolean), // discard undefined if not found
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
  refreshToken: null,
  refreshTokenExpires: null,
});

export const UsersData = [
  {
    name: 'Juan',
    surname: 'Pérez',
    nameComplete: 'juan perez',
    email: 'superadmin@correo.com',
    password: 'Abc123',
    telephone: '+50518889999',
    profilePhotoUrl: null,
    isAccountConfirmed: true,
    status: true,
    role: ValidRoles.superAdmin,
    security: createEmptySecurity(),
  },
  {
    name: 'Ana',
    surname: 'García',
    nameComplete: 'ana garcia',
    email: 'admin@correo.com',
    password: 'Abc123',
    telephone: '+50517776666',
    profilePhotoUrl: null,
    isAccountConfirmed: true,
    status: true,
    role: ValidRoles.admin,
    security: createEmptySecurity(),
  },
  {
    name: 'Michael',
    surname: 'García',
    nameComplete: 'michael garcia',
    email: 'user@correo.com',
    password: 'Abc123',
    telephone: '+50512776666',
    profilePhotoUrl: null,
    isAccountConfirmed: true,
    status: true,
    role: ValidRoles.user,
    security: createEmptySecurity(),
  },
];
