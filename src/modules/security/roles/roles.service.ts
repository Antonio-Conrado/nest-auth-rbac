import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import {
  ApiResponseMessages,
  ApiResponseSuspendOrActivate,
} from 'src/common/handlers/api-response-messages.handlers';
import { exceptionFilter } from 'src/common/exceptions/exception-filter';
import { Permission } from '../permissions/entities/permission.entity';
import { ValidRoles } from 'src/common/data/valid-roles';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    private readonly exceptionFilter: exceptionFilter,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      await this.rolesRepository.save(createRoleDto);
      return { message: ApiResponseMessages('el rol').created };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async findAll() {
    try {
      return await this.rolesRepository.find({ order: { id: 'ASC' } });
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.rolesRepository.findOneBy({ id });
      if (!role)
        throw new NotFoundException(ApiResponseMessages('el rol').notFound);
      return role;
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesRepository.findOne({ where: { id } });

      if (role?.name === ValidRoles.admin) {
        throw new ConflictException(
          'El rol administrador es reservado y su nombre no puede ser editado.',
        );
      }
      await this.rolesRepository.update(id, updateRoleDto);
      return { message: ApiResponseMessages('el rol').updated };
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }

  async toggleStatus(id: number) {
    try {
      const role = await this.findOne(id);

      if (role) {
        if (role.name === ValidRoles.admin) {
          throw new ConflictException(
            'Por razones de seguridad, no se permite desactivar el rol administrador',
          );
        }
        role.status = !role.status;
        await this.rolesRepository.save(role);
        return {
          message: ApiResponseSuspendOrActivate('el rol', role.status),
        };
      }
    } catch (error) {
      this.exceptionFilter.catch(error);
    }
  }

  async asignPermissionsToRole(roleId: number, permissionIds: number[]) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
      });

      if (!role) return { message: ApiResponseMessages('el rol').notFound };
      if (!role.status) {
        throw new ConflictException(ApiResponseMessages('el rol').deactivated);
      }

      if (role.name === ValidRoles.admin) {
        throw new ConflictException(
          'Por razones de seguridad, no está permitido modificar los permisos del rol administrador',
        );
      }

      const permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });

      role.permissions = permissions;
      await this.rolesRepository.save(role);
      return {
        message: `Permisos asignados correctamente al rol: ${role.name}`,
      };
    } catch (error) {
      return this.exceptionFilter.catch(error);
    }
  }
}
