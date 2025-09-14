import {
  Controller,
  Post,
  Body,
  HttpCode,
  Version,
  Param,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  ApiProfileDoc,
  ApiRegisterDoc,
  ApiResetPasswordDoc,
} from 'src/common/handlers/api-create-doc.handlers';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  @ApiRegisterDoc()
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @Version('1')
  @HttpCode(200)
  @ApiLoginDoc()
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('profile/:id')
  @Version('1')
  @HttpCode(200)
  @ApiProfileDoc()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  Profile(
    @Param('id', IdValidationPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    const user = req.user;
    return this.authService.Profile(id, user);
  }

  @Post('logout')
  @Version('1')
  @HttpCode(200)
  @ApiLogoutDoc()
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post('confirm-account')
  @Version('1')
  @HttpCode(200)
  @ApiConfirmAccountDoc()
  confirmAccount(@Body() confirmAccountDto: ConfirmAccountDto) {
    return this.authService.confirmAccount(confirmAccountDto);
  }

  @Post('forgot-password')
  @Version('1')
  @HttpCode(200)
  @ApiForgotPasswordDoc()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Version('1')
  @HttpCode(200)
  @ApiResetPasswordDoc()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
