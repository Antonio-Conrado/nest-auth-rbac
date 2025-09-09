import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import {
  ApiCreateDoc,
  ApiFindAllDoc,
  ApiFindOneDoc,
  ApiToggleStatusDoc,
  ApiUpdateDoc,
  ApiUpdatePasswordDoc,
  ApiUploadFileDoc,
} from 'src/common/handlers/api-create-doc.handlers';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import { ValidPermissions } from 'src/common/data/valid-permissions';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Version('1')
  @ApiCreateDoc('el usuario')
  @Auth(ValidPermissions.userCreate, ValidPermissions.adminFullAccess)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Version('1')
  @ApiFindAllDoc('usuario')
  @Auth(ValidPermissions.usersFindAll, ValidPermissions.adminFullAccess)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Version('1')
  @ApiFindOneDoc('el usuario')
  @Auth(ValidPermissions.userFindOne, ValidPermissions.adminFullAccess)
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Version('1')
  @ApiUpdateDoc('el usuario')
  @Auth(ValidPermissions.userUpdate, ValidPermissions.adminFullAccess)
  update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('change-password/:id')
  @ApiUpdatePasswordDoc('el usuario')
  @Auth(ValidPermissions.userUpdate, ValidPermissions.adminFullAccess)
  changePassword(
    @Param('id', IdValidationPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Patch('toogle-status/:id')
  @Version('1')
  @ApiToggleStatusDoc('el usuario')
  @Auth(ValidPermissions.userToggleStatus, ValidPermissions.adminFullAccess)
  toogleStatus(@Param('id', IdValidationPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }

  @Post(':id/upload')
  @Version('1')
  @ApiUploadFileDoc('la imagen', 'image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @Param('id', IdValidationPipe) id: number,
  ) {
    return this.usersService.uploadImage(image, id);
  }
}
