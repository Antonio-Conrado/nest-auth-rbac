import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/services/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ConfirmAccountDto, LoginAuthDto, RegisterAuthDto } from '../dto';
import { ApiResponseDto } from 'src/common/dto';
import { ApiResponseMessages } from 'src/common/handlers/api-response-messages.handlers';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/common/data/valid-roles';
import { LoginResponseDto } from '../dto/login-auth.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { StringValue } from 'ms';
import { getExpirationDate } from 'src/common/utils/getExpirationDate';
import { UserDto } from '../../users/dto/user.dto';
import { LogoutDto } from '../dto/logout.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private ConfigService: ConfigService,
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

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        role: { permissions: true },
        security: true,
      },
    });
    //validations
    if (!user)
      throw new NotFoundException(ApiResponseMessages('el usuario').notFound);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Contraseña inválida');

    if (!user.isAccountConfirmed)
      throw new ConflictException(
        'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para completar la confirmación.',
      );

    // Generate the payload to be included in the JWT
    const payload: JwtPayload = {
      id: user.id,
    };

    // Get the token expiration values from the environment variables
    const REMEMBER_ME_TOKEN_EXPIRES_IN = this.ConfigService.get<StringValue>(
      'REMEMBER_ME_TOKEN_EXPIRES_IN',
    )!;
    const REFRESH_TOKEN_EXPIRES_IN = this.ConfigService.get<StringValue>(
      'REFRESH_TOKEN_EXPIRES_IN',
    )!;

    //generate token with uuidv4 and set date at refresttoen expires
    user.security.refreshToken = uuidv4();
    user.security.refreshTokenExpires = getExpirationDate(
      REFRESH_TOKEN_EXPIRES_IN,
    );

    // Generate remember token if requested
    if (loginAuthDto.remember_me) {
      user.security.rememberToken = uuidv4();
      user.security.rememberTokenExpires = getExpirationDate(
        REMEMBER_ME_TOKEN_EXPIRES_IN,
      );
    }

    await this.userRepository.save(user);

    return {
      message: 'Se ha iniciado sesión correctamente.',
      data: {
        accessToken: this.getJwtToken(payload),
        refreshToken: user.security.refreshToken,
        rememberToken: user.security.rememberToken,
      },
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  Profile(user: User): ApiResponseDto<UserDto> {
    return {
      message: 'Perfil obtenido con éxito',
      data: new UserDto(user),
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }

  async logout(logoutDto: LogoutDto): Promise<ApiResponseDto> {
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
    user.security.refreshToken = null;
    user.security.refreshTokenExpires = null;
    await this.userRepository.save(user);

    return {
      message: 'Sesión cerrada correctamente.',
      data: null,
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }

  async confirmAccount(
    confirmAccountDto: ConfirmAccountDto,
  ): Promise<ApiResponseDto> {
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

    return {
      message: 'Cuenta confirmada correctamente.',
      data: null,
      statusCode: HttpStatus.OK,
      type: 'success',
    };
  }
}
