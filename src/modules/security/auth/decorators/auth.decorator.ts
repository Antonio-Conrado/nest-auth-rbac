import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionProtected } from './permission-protected.decorator';
import { UserPermissionGuard } from '../guards/user-permission.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...permissions: string[]) {
  return applyDecorators(
    ApiBearerAuth(), // Configures Swagger to send the Bearer token in the Authorization header when testing the API
    PermissionProtected(...permissions),
    UseGuards(AuthGuard('jwt'), UserPermissionGuard),
  );
}
