import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'refresh token emitido al iniciar sesión',
    example: '550e8......',
  })
  @IsUUID('4', { message: 'El refresh token no es válido' })
  refreshToken: string;
}

export class RememberTokenDto {
  @ApiProperty({
    description:
      'Remember token emitido al iniciar sesión para mantener la sesión activa',
    example: '550e8......',
  })
  @IsUUID('4', { message: 'El remember token no es válido' })
  rememberToken: string;
}
