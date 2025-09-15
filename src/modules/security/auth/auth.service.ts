import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

import {
  ConfirmAccountDto,
  ForgotPasswordDto,
  LoginAuthDto,
  RegisterAuthDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LogoutDto } from './dto/logout.dto';
import { MailService } from 'src/common/services/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { PasswordRecoveryService } from './services/password-recovery.service';
import { AccountService } from './services/account.service';
import { RefreshTokenDto, RememberTokenDto } from './dto/token.dto';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly passwordRecoveryService: PasswordRecoveryService,
    private readonly accountService: AccountService,
    private readonly tokenService: TokenService,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private ConfigService: ConfigService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    return this.accountService.register(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    return this.accountService.login(loginAuthDto);
  }

  Profile(user: User) {
    return this.accountService.Profile(user);
  }

  async logout(logoutDto: LogoutDto) {
    return this.accountService.logout(logoutDto);
  }
  async confirmAccount(confirmAccountDto: ConfirmAccountDto) {
    return this.accountService.confirmAccount(confirmAccountDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordRecoveryService.forgotPassword(forgotPasswordDto);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(resetPasswordDto);
  }

  async generateAccessToken(refreshTokenDto: RefreshTokenDto) {
    return this.tokenService.generateAccessToken(refreshTokenDto);
  }

  async generateAccessTokenFromRememberToken(
    rememberTokenDto: RememberTokenDto,
  ) {
    return this.tokenService.generateAccessTokenFromRememberToken(
      rememberTokenDto,
    );
  }
}
