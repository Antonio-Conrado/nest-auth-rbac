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
  Req,
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
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Version('1')
  @ApiCreateDoc('el usuario')
  @Auth(ValidPermissions.userCreate)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Version('1')
  @ApiFindAllDoc('usuario')
  @Auth(ValidPermissions.usersRead)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Version('1')
  @ApiFindOneDoc('el usuario')
  @Auth(ValidPermissions.userReadOne)
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Version('1')
  @ApiUpdateDoc('el usuario')
  @Auth(ValidPermissions.userUpdate)
  update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('change-password/:id')
  @Version('1')
  @ApiUpdatePasswordDoc('el usuario')
  @Auth(ValidPermissions.userUpdate)
  changePassword(
    @Param('id', IdValidationPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Patch('toogle-status/:id')
  @Version('1')
  @ApiToggleStatusDoc('el usuario')
  @Auth(ValidPermissions.userToggleStatus)
  toogleStatus(
    @Param('id', IdValidationPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    const userAuthenticatedId = req.user.id;
    return this.usersService.toggleStatus(id, userAuthenticatedId);
  }

  @Post(':id/upload-image')
  @Version('1')
  @ApiUploadFileDoc('la imagen', 'image')
  @Auth(ValidPermissions.userUploadImage)
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @Param('id', IdValidationPipe) id: number,
  ) {
    return this.usersService.uploadImage(image, id);
  }
}
