import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email asociado a la cuenta para cerrar sesión',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  email: string;
}
