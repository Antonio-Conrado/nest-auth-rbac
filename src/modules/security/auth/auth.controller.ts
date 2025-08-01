import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmAccountDto,
  ForgotPasswordDto,
  LoginAuthDto,
  RegisterAuthDto,
  ResetPasswordDto,
} from './dto';
import { LogoutDto } from './dto/logout.dto';
import {
  ApiConfirmAccountDoc,
  ApiForgotPasswordDoc,
  ApiLoginDoc,
  ApiLogoutDoc,
  ApiRegisterDoc,
  ApiResetPasswordDoc,
} from 'src/common/handlers/api-create-doc.handlers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiRegisterDoc()
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiLoginDoc()
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiLogoutDoc()
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post('confirm-account')
  @HttpCode(200)
  @ApiConfirmAccountDoc()
  confirmAccount(@Body() confirmAccountDto: ConfirmAccountDto) {
    return this.authService.confirmAccount(confirmAccountDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiForgotPasswordDoc()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiResetPasswordDoc()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
