import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiCreateDoc,
  ApiFindAllDoc,
  ApiFindOneDoc,
  ApiToggleStatusDoc,
  ApiUpdateDoc,
} from 'src/common/handlers/api-create-doc.handlers';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { ValidPermissions } from 'src/common/data/valid-permissions';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiCreateDoc('el permiso')
  @Auth(ValidPermissions.permissionCreate, ValidPermissions.adminFullAccess)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiFindAllDoc('permiso')
  @Auth(ValidPermissions.permissionsFindAll, ValidPermissions.adminFullAccess)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiFindOneDoc('el permiso')
  @Auth(ValidPermissions.permissionFindOne, ValidPermissions.adminFullAccess)
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateDoc('el permiso')
  @Auth(ValidPermissions.permissionUpdate, ValidPermissions.adminFullAccess)
  update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Patch('toggle-status/:id')
  @ApiToggleStatusDoc('el permiso')
  @Auth(
    ValidPermissions.permissionToggleStatus,
    ValidPermissions.adminFullAccess,
  )
  toggleStatus(@Param('id', IdValidationPipe) id: number) {
    return this.permissionsService.toggleStatus(id);
  }
}
