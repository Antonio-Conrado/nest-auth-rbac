import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/services/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto';
import { ApiResponseDto } from 'src/common/dto';
import { ApiResponseMessages } from 'src/common/handlers/api-response-messages.handlers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private ConfigService: ConfigService,
  ) {}

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponseDto> {
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
      data: null,
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponseDto> {
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
    user.security.refreshToken = null;
    user.security.refreshTokenExpires = null;
    user.security.rememberToken = null;
    user.security.rememberTokenExpires = null;

    await this.userRepository.save(user);

    return {
      message: 'Se ha restablecido correctamente la contraseña.',
      data: null,
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }
}
