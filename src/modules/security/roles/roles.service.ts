import {
  ConflictException,
  HttpStatus,
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
import { Permission } from '../permissions/entities/permission.entity';
import { ValidRoles } from 'src/common/data/valid-roles';
import { ApiResponseDto } from 'src/common/dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<ApiResponseDto<Role>> {
    const role = await this.rolesRepository.save(createRoleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ApiResponseMessages('el rol').created,
      data: role,
      type: 'success',
    };
  }

  async findAll(): Promise<ApiResponseDto<Role[]>> {
    const roles = await this.rolesRepository.find({
      order: { id: 'ASC' },
      relations: { permissions: true },
    });
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('los roles').found,
      data: roles,
      type: 'success',
    };
  }

  async findOne(id: number): Promise<ApiResponseDto<Role>> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role)
      throw new NotFoundException(ApiResponseMessages('el rol').notFound);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el rol').found,
      data: role,
      type: 'success',
    };
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponseDto<null>> {
    const { data: role } = await this.findOne(id);
    if (!role) throw new NotFoundException();

    if (role.name === ValidRoles.superAdmin) {
      throw new ConflictException(
        'El rol Super Administrador es reservado y su nombre no puede ser editado.',
      );
    }
    await this.rolesRepository.update(id, updateRoleDto);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages('el rol').updated,
      data: null,
      type: 'success',
    };
  }

  async toggleStatus(
    id: number,
    userAuthenticatedId: number,
  ): Promise<ApiResponseDto<null>> {
    const { data: role } = await this.findOne(id);
    if (!role) throw new NotFoundException();

    if (role.name === ValidRoles.superAdmin) {
      throw new ConflictException(
        'Por razones de seguridad, no se permite desactivar el rol Super Administrador',
      );
    }
    if (userAuthenticatedId === id)
      throw new ConflictException(
        'No puedes desactivar el rol de tu propia cuenta por seguridad. Esta acción debe ser realizada por otro usuario con permisos adecuados.',
      );
    role.status = !role.status;
    await this.rolesRepository.save(role);
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseSuspendOrActivate('el rol', role.status),
      data: null,
      type: 'success',
    };
  }

  async asignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<ApiResponseDto<Role>> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role)
      throw new NotFoundException(ApiResponseMessages('el rol').notFound);
    if (!role.status) {
      throw new ConflictException(ApiResponseMessages('el rol').deactivated);
    }

    if (role.name === ValidRoles.superAdmin) {
      throw new ConflictException(
        'Por razones de seguridad, no está permitido modificar los permisos del rol Super Administrador',
      );
    }

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    role.permissions = permissions;
    await this.rolesRepository.save(role);

    return {
      statusCode: HttpStatus.OK,
      message: `Permisos asignados correctamente al rol: ${role.name}`,
      data: role,
      type: 'success',
    };
  }
}
