import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description:
      'Email asociado a la cuenta para enviar el link de restablecimiento',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  email: string;
}
