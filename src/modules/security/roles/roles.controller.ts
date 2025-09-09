import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Version,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import {
  ApiCreateDoc,
  ApiFindAllDoc,
  ApiFindOneDoc,
  ApiToggleStatusDoc,
  ApiUpdateDoc,
} from 'src/common/handlers/api-create-doc.handlers';
import { AssignPermissionsDto } from './dto/assing-permissions-dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidPermissions } from 'src/common/data/valid-permissions';
import { ApiOperation } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Version('1')
  @ApiCreateDoc('el rol')
  @Auth(ValidPermissions.roleCreate, ValidPermissions.adminFullAccess)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Version('1')
  @ApiFindAllDoc('role')
  @Auth(ValidPermissions.rolesFindAll, ValidPermissions.adminFullAccess)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Version('1')
  @ApiFindOneDoc('el rol')
  @Auth(ValidPermissions.roleFindOne, ValidPermissions.adminFullAccess)
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Version('1')
  @ApiUpdateDoc('el rol')
  @Auth(ValidPermissions.roleUpdate, ValidPermissions.adminFullAccess)
  update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Patch('toggle-status/:id')
  @Version('1')
  @ApiToggleStatusDoc('el rol')
  @Auth(ValidPermissions.roleToggleStatus, ValidPermissions.adminFullAccess)
  toggleStatus(@Param('id', IdValidationPipe) id: number) {
    return this.rolesService.toggleStatus(id);
  }

  @Patch(':id/permissions')
  @Version('1')
  @ApiOperation({ summary: 'Asignar permisos al rol' })
  @Auth(
    ValidPermissions.roleAssignPermissions,
    ValidPermissions.adminFullAccess,
  )
  asignPermissionsToRole(
    @Param('id', IdValidationPipe) id: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.asignPermissionsToRole(
      id,
      assignPermissionsDto.permissionIds,
    );
  }
}
