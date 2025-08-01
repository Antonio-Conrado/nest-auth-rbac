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
import { exceptionFilter } from 'src/common/exceptions/exception-filter';
import {
  ApiResponseMessages,
  ApiResponseSuspendOrActivate,
} from 'src/common/handlers/api-response-messages.handlers';
import { RolesService } from '../roles/roles.service';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { convertFileToBase64String } from 'src/common/handlers/encoded-file.handler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly roleRepository: RolesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly exceptionFilter: exceptionFilter,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const role = await this.roleRepository.findOne(createUserDto.roleId);
      if (role) {
        const user = this.userRepository.create({
          ...createUserDto,
          role,
          security: {},
        });
        user.isAccountConfirmed = true;
        await this.userRepository.save(user);
        return { message: ApiResponseMessages('el usuario').created };
      }
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { take = 10, skip = 0 } = paginationDto;

    try {
      const users = await this.userRepository.find({
        take,
        skip,
        order: { id: 'ASC' },
      });

      return users;
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user)
        throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

      if (!user.isAccountConfirmed)
        throw new ConflictException(
          'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
        );

      return user;
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);
      if (updateUserDto.roleId) {
        await this.roleRepository.findOne(updateUserDto.roleId);
      }
      await this.userRepository.update(id, updateUserDto);
      return { message: ApiResponseMessages('el usuario').updated };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.password !== changePasswordDto.passwordConfirmation) {
      throw new BadRequestException(
        'La confirmación de la contraseña no coincide',
      );
    }
    try {
      const user = await this.findOne(id);
      const password = await bcrypt.hash(changePasswordDto.password, 10);

      await this.userRepository.update(user.id, { password });
      return {
        message: 'Se actualizó correctamente la contraseña',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async toggleStatus(id: number) {
    try {
      const user = await this.findOne(id);
      if (user) {
        await this.userRepository.remove(user);
        return {
          message: ApiResponseSuspendOrActivate('el usuario', user.status),
        };
      }
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async uploadImage(image: Express.Multer.File, id: number) {
    try {
      const user = await this.findOne(id);
      const imageDataString = convertFileToBase64String(image);
      const url = await this.cloudinaryService.upload(imageDataString);

      user.profilePhotoUrl = url;
      await this.userRepository.save(user);
      return { message: 'La imagen se subió correctamente' };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }
}
