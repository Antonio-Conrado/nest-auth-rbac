import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { ApiResponseMessages } from 'src/common/handlers/api-response-messages.handlers';

import { ForgotPasswordDto, LoginAuthDto, RegisterAuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/common/data/valid-roles';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LogoutDto } from './dto/logout.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { MailService } from 'src/common/services/nodemailer.service';
import { ApiResponseDto } from 'src/common/dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(
    registerAuthDto: RegisterAuthDto,
  ): Promise<ApiResponseDto<null>> {
    const usersCount = await this.userRepository.count();

    const roleName = usersCount === 0 ? ValidRoles.admin : ValidRoles.user;
    const role = await this.roleRepository.findOne({
      where: { name: roleName, status: true },
    });

    if (!role) {
      throw new BadRequestException(
        `El rol ${roleName} no está disponible o no existe. Por favor, configure los roles antes de continuar.`,
      );
    }

    const confirmationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = this.userRepository.create({
      ...registerAuthDto,
      roleId: role.id,
      security: {
        confirmationToken,
      },
    });

    await this.userRepository.save(user);

    await this.mailService.sendMail(user.email, 'account-confirmation', {
      name: user.name + ' ' + user.surname,
      email: user.email,
      confirmationToken: user.security.confirmationToken,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: ApiResponseMessages('el usuario').registerUser,
      data: null,
      type: 'success',
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        role: { permissions: true },
        security: true,
      },
    });
    if (!user)
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Contraseña inválida');

    if (!user.isAccountConfirmed)
      throw new ConflictException(
        'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
      );

    const payload: JwtPayload = {
      id: user.id,
    };

    if (loginAuthDto.remember) {
      user.security.rememberToken = uuidv4();
      user.security.rememberTokenExpires = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );
      await this.userRepository.save(user);
      return {
        rememberToken: user.security.rememberToken,
        token: this.getJwtToken(payload),
      };
    }

    return {
      token: this.getJwtToken(payload),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  Profile(id: number, user: User) {
    if (user.id !== id)
      throw new ForbiddenException(
        'No puedes acceder al perfil de otro usuario',
      );

    return new UserDto(user);
  }

  async logout(logoutDto: LogoutDto) {
    const { email } = logoutDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: { security: true },
    });
    if (!user) {
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);
    }

    user.security.rememberToken = null;
    user.security.rememberTokenExpires = null;
    await this.userRepository.save(user);

    return { message: 'Sesión cerrada correctamente.' };
  }

  async confirmAccount(confirmAccountDto: ConfirmAccountDto) {
    const { email, confirmationToken } = confirmAccountDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: { security: true },
    });
    if (!user) {
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);
    }

    if (user.security.confirmationToken !== confirmationToken)
      throw new BadRequestException('El token de confirmación no es válido.');

    user.security.confirmationToken = null;
    user.isAccountConfirmed = true;
    await this.userRepository.save(user);

    return { message: 'Cuenta confirmada correctamente.' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: { security: true },
    });

    if (!user)
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

    if (!user.isAccountConfirmed)
      throw new ConflictException(
        'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
      );

    user.security.resetPasswordToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    user.security.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.save(user);

    await this.mailService.sendMail(user.email, 'forgot-password', {
      name: user.name + ' ' + user.surname,
      email: user.email,
      resetPasswordToken: user.security.resetPasswordToken,
    });
    return {
      message:
        'Se ha enviado un correo con instrucciones para restablecer su contraseña. El enlace será válido por un máximo de 1 hora.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, resetPasswordToken, password, passwordConfirm } =
      resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: { security: true },
    });

    if (!user) {
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);
    }

    if (!user.isAccountConfirmed)
      throw new ConflictException(
        'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
      );

    const now = new Date();
    if (
      !user.security.resetPasswordExpires ||
      user.security.resetPasswordExpires < now
    ) {
      throw new BadRequestException(
        'El token ha expirado. Por favor, solicita un nuevo enlace para restablecer tu contraseña.',
      );
    }

    if (user.security.resetPasswordToken !== resetPasswordToken) {
      throw new BadRequestException(
        'El token no coincide. Verifica que el token sea correcto y que no haya expirado.',
      );
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    user.password = await bcrypt.hash(password, 10);
    user.security.resetPasswordToken = null;
    user.security.resetPasswordExpires = null;

    await this.userRepository.save(user);

    return { message: 'Se ha restablecido correctamente la contraseña.' };
  }
}
