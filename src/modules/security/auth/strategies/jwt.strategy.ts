import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      // Validates that the token is valid using the JWT secret
      secretOrKey: configService.get('JWT_SECRET')!,
      // Extracts the JWT from the Authorization Bearer header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // This method is executed only if the token is valid.
  // Passport automatically rejects the request and sends an HTTP 401 Unauthorized response if the token is invalid.
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    });

    if (!user)
      throw new UnauthorizedException('El token proporcionado no es válido');
    if (!user.status)
      throw new UnauthorizedException(
        'El usuario esta inhabilitado o no existe. Contacte con un administrador',
      );

    return user;
  }
}
