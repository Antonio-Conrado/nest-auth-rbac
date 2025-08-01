import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { exceptionFilter } from 'src/common/exceptions/exception-filter';
import {
  ApiResponseMessages,
  ApiResponseSuspendOrActivate,
} from 'src/common/handlers/api-response-messages.handlers';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly exceptionFilter: exceptionFilter,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      await this.permissionRepository.save(createPermissionDto);
      return { message: ApiResponseMessages('el permiso').created };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async findAll() {
    try {
      return await this.permissionRepository.find({ order: { id: 'ASC' } });
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }

  async findOne(id: number) {
    try {
      const permission = await this.permissionRepository.findOneBy({ id });
      if (!permission)
        throw new NotFoundException(ApiResponseMessages('el permiso').notFound);
      return permission;
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      await this.findOne(id);
      await this.permissionRepository.update(id, updatePermissionDto);
      return { message: ApiResponseMessages('el permiso').updated };
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }

  async toggleStatus(id: number) {
    try {
      const permission = await this.findOne(id);
      if (permission) {
        permission.status = !permission.status;
        await this.permissionRepository.save(permission);
        return {
          message: ApiResponseSuspendOrActivate(
            'el permiso',
            permission.status,
          ),
        };
      }
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }
}
