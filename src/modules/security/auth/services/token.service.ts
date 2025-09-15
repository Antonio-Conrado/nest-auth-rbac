import {
  BadRequestException,
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
import { RefreshTokenDto } from '../dto';
import { ApiResponseDto } from 'src/common/dto';
import { LoginResponseDto } from '../dto/login-auth.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RememberTokenDto } from '../dto/token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private ConfigService: ConfigService,
  ) {}

  async generateAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const { refreshToken } = refreshTokenDto;
    const user = await this.userRepository.findOne({
      where: { security: { refreshToken } },
      relations: { security: true },
    });

    if (!user) throw new NotFoundException('Refresh token no encontrado');

    if (
      !user.security.refreshTokenExpires ||
      user.security.refreshTokenExpires <= new Date()
    )
      throw new BadRequestException('Refresh token inválido o expirado');

    const accessToken = this.getJwtToken({ id: user.id });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Token generado correctamente',
      data: {
        accessToken,
      },
      type: 'success',
    };
  }

  async generateAccessTokenFromRememberToken(
    rememberTokenDto: RememberTokenDto,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const { rememberToken } = rememberTokenDto;
    const user = await this.userRepository.findOne({
      where: { security: { rememberToken } },
      relations: { security: true },
    });

    if (!user) throw new NotFoundException('Remember token no encontrado');

    if (
      !user.security.rememberTokenExpires ||
      user.security.rememberTokenExpires <= new Date()
    )
      throw new BadRequestException('Remember token inválido o expirado');

    const accessToken = this.getJwtToken({ id: user.id });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Token generado correctamente',
      data: {
        accessToken,
      },
      type: 'success',
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
