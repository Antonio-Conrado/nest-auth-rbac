import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Version,
} from '@nestjs/common';
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
  @Version('1')
  @ApiCreateDoc('el permiso')
  @Auth(ValidPermissions.permissionCreate)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Version('1')
  @ApiFindAllDoc('permiso')
  @Auth(ValidPermissions.permissionsRead)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Version('1')
  @ApiFindOneDoc('el permiso')
  @Auth(ValidPermissions.permissionReadOne)
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Version('1')
  @ApiUpdateDoc('el permiso')
  @Auth(ValidPermissions.permissionUpdate)
  update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Patch('toggle-status/:id')
  @Version('1')
  @ApiToggleStatusDoc('el permiso')
  @Auth(ValidPermissions.permissionToggleStatus)
  toggleStatus(@Param('id', IdValidationPipe) id: number) {
    return this.permissionsService.toggleStatus(id);
  }
}
