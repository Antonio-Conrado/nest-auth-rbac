import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permission-protected.decorator';
import { User } from '../../users/entities/user.entity';
import { ValidPermissions } from 'src/common/data/valid-permissions';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions: string[] = this.reflector.get(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!permissions) return false;
    if (permissions.length === 0) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as User;

    if (!user)
      throw new BadRequestException(
        'Usuario no encontrado. Inicie sesión para acceder',
      );
    if (!user.role.permissions)
      throw new BadRequestException(
        `El usuario ${user.name + ' ' + user.surname} no tiene permisos disponibles. Contacte con un administrador`,
      );

    const isAdmin = user.role.permissions.some(
      (permission) => permission.name === ValidPermissions.adminFullAccess,
    );

    if (isAdmin) {
      return true;
    }

    const hasValidPermission = user.role.permissions.some((permission) =>
      permissions.includes(permission.name),
    );

    if (!hasValidPermission) {
      const filteredPermissions = permissions.filter(
        (name) => name !== ValidPermissions.adminFullAccess,
      );

      throw new ForbiddenException(
        `El usuario ${user.name} ${user.surname} necesita tener al menos uno de estos permisos: ${filteredPermissions.join(
          ', ',
        )}`,
      );
    }

    return true;
  }
}
