import { Repository, DeepPartial, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PermissionsData, RolesData, UsersData } from '../data/security.data';
import { Permission } from 'src/modules/security/permissions/entities/permission.entity';
import { Role } from 'src/modules/security/roles/entities/role.entity';
import { IRoleSeed } from '../interfaces/security.interface';
import { User } from 'src/modules/security/users/entities/user.entity';
import { UserSecurity } from 'src/modules/security/users/entities/user-security.entity';

export async function seedPermissions(permissionRepo: Repository<Permission>) {
  await permissionRepo.save(PermissionsData);
  return await permissionRepo.find();
}

export async function seedRoles(
  roleRepo: Repository<Role>,
  allPermissions: Permission[],
) {
  const rolesWithPermissions: DeepPartial<Role>[] = (
    RolesData as IRoleSeed[]
  ).map((role) => ({
    name: role.name,
    status: role.status,
    permissions: allPermissions.filter((permission) =>
      role.permissions.some((p) => p.name === permission.name),
    ),
  }));

  await roleRepo.save(rolesWithPermissions);
  return await roleRepo.find();
}

export async function seedUsers(
  userRepo: Repository<User>,
  userSecurityRepo: Repository<UserSecurity>,
  savedRoles: Role[],
) {
  const usersToInsert: DeepPartial<User>[] = await Promise.all(
    UsersData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const roleEntity = savedRoles.find((role) => role.name === user.role);

      if (!roleEntity) {
        throw new Error(
          `Rol "${user.role}" no encontrado para el usuario "${user.email}"`,
        );
      }

      return {
        ...user,
        password: hashedPassword,
        role: roleEntity,
        roleId: roleEntity.id,
      };
    }),
  );

  await userRepo.save(usersToInsert);
  const savedUsers = await userRepo.find();

  const userSecurityToInsert: DeepPartial<UserSecurity>[] = savedUsers.map(
    (savedUser) => {
      const originalUser = UsersData.find(
        (user) => user.email === savedUser.email,
      );

      if (!originalUser || !originalUser.security) {
        throw new Error(
          `No se encontraron los datos de seguridad para el usuario con email: "${savedUser.email}". Por favor, verifica que la información esté completa.`,
        );
      }

      return {
        ...originalUser.security,
        user: savedUser,
      };
    },
  );

  await userSecurityRepo.save(userSecurityToInsert);

  return savedUsers;
}

export async function executeSecuritySeed(dataSource: DataSource) {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const userSecurityRepo = dataSource.getRepository(UserSecurity);

  const allPermissions = await seedPermissions(permissionRepo);
  const savedRoles = await seedRoles(roleRepo, allPermissions);
  // Seed users with roles and security data
  await seedUsers(userRepo, userSecurityRepo, savedRoles);
  return;
}
