import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import {
  ApiResponseMessages,
  ApiResponseSuspendOrActivate,
} from 'src/common/handlers/api-response-messages.handlers';
import { RolesService } from '../roles/roles.service';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { convertFileToBase64String } from 'src/common/handlers/encoded-file.handler';
import { ApiResponseDto, PaginatedDto } from 'src/common/dto';
import { UserListItemDto } from './dto/users-list-item.dto';
import { PaginationData } from 'src/common/utils/pagination-data.utils';
import { UserDto } from './dto/user.dto';
import { ValidRoles } from 'src/common/data/valid-roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly roleRepository: RolesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponseDto> {
    const { data: role } = await this.roleRepository.findOne(
      createUserDto.roleId,
    );
    if (!role) throw new NotFoundException();

    const user = this.userRepository.create({
      ...createUserDto,
      role,
      security: {},
    });
    user.isAccountConfirmed = true;
    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.CREATED,
      message: ApiResponseMessages('el usuario').created,
      data: null,
      type: 'success',
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<ApiResponseDto<PaginatedDto<UserListItemDto>>> {
    const { take = 10, skip = 0 } = paginationDto;

    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip,
      order: { id: 'ASC' },
      relations: { role: true },
    });

    const items = users.map((user) => new UserListItemDto(user));
    const meta = PaginationData(skip, take, total);

    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('los usuarios').found,
      data: { items, meta },
      type: 'success',
    };
  }

  async findOne(id: number): Promise<ApiResponseDto<UserDto>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    });
    if (!user)
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

    if (!user.isAccountConfirmed)
      throw new ConflictException(
        'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
      );

    const userDto = new UserDto(user);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el usuario').found,
      data: userDto,
      type: 'success',
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<null>> {
    await this.findOne(id);
    if (updateUserDto.roleId) {
      await this.roleRepository.findOne(updateUserDto.roleId);
    }
    await this.userRepository.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el usuario').updated,
      data: null,
      type: 'success',
    };
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ApiResponseDto<null>> {
    if (changePasswordDto.password !== changePasswordDto.passwordConfirmation) {
      throw new BadRequestException(
        'La confirmación de la contraseña no coincide',
      );
    }
    const { data: user } = await this.findOne(id);
    if (!user) throw new NotFoundException();
    const password = await bcrypt.hash(changePasswordDto.password, 10);

    await this.userRepository.update(user.id, { password });
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente la contraseña',
      data: null,
      type: 'success',
    };
  }

  async toggleStatus(
    id: number,
    userAuthenticatedId: User['id'],
  ): Promise<ApiResponseDto<null>> {
    const { data: user } = await this.findOne(id);
    if (!user)
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

    if (user.role.name === ValidRoles.superAdmin) {
      throw new ConflictException(
        ApiResponseMessages('').cannotDeactivateSuperAdmin,
      );
    }

    if (userAuthenticatedId === id)
      throw new ConflictException(
        'No puedes desactivar tu propia cuenta por seguridad. Esta acción debe ser realizada por otro usuario con permisos adecuados.',
      );

    user.status = !user.status;
    await this.userRepository.save(user);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseSuspendOrActivate('el usuario', user.status),
      data: null,
      type: 'success',
    };
  }

  async uploadImage(
    image: Express.Multer.File,
    id: number,
  ): Promise<ApiResponseDto<Partial<UserDto>>> {
    const { data: user } = await this.findOne(id);
    if (!user) throw new NotFoundException();

    const imageDataString = convertFileToBase64String(image);
    const url = await this.cloudinaryService.upload(imageDataString);

    user.profilePhotoUrl = url;
    await this.userRepository.save(user);
    return {
      statusCode: HttpStatus.OK,
      message: 'La imagen se subió correctamente',
      data: { profilePhotoUrl: user.profilePhotoUrl },
      type: 'success',
    };
  }
}
