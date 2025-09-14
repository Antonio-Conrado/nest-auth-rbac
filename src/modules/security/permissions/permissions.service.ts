import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import {
  ApiResponseMessages,
  ApiResponseSuspendOrActivate,
} from 'src/common/handlers/api-response-messages.handlers';
import { ApiResponseDto } from 'src/common/dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<ApiResponseDto<Permission>> {
    const permission =
      await this.permissionRepository.save(createPermissionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ApiResponseMessages('el permiso').created,
      data: permission,
      type: 'success',
    };
  }

  async findAll(): Promise<ApiResponseDto<Permission[]>> {
    const permissions = await this.permissionRepository.find({
      order: { id: 'ASC' },
    });
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('los permisos').found,
      data: permissions,
      type: 'success',
    };
  }

  async findOne(id: number): Promise<ApiResponseDto<Permission>> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission)
      throw new NotFoundException(ApiResponseMessages('el permiso').notFound);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el permiso').found,
      data: permission,
      type: 'success',
    };
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<ApiResponseDto<null>> {
    const { data: permission } = await this.findOne(id);
    if (!permission) throw new NotFoundException();

    if (permission.name === 'admin') {
      throw new ConflictException(
        'El permiso administrador es reservado y no puede ser modificado.',
      );
    }

    await this.permissionRepository.update(id, updatePermissionDto);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el permiso').updated,
      data: null,
      type: 'success',
    };
  }

  async toggleStatus(id: number): Promise<ApiResponseDto<null>> {
    const { data: permission } = await this.findOne(id);
    if (!permission) throw new NotFoundException();

    permission.status = !permission.status;
    await this.permissionRepository.save(permission);

    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseSuspendOrActivate('el permiso', permission.status),
      data: null,
      type: 'success',
    };
  }
}
