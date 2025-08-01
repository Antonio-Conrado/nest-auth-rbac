import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAccountDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email asociado a la cuenta para activar la cuenta',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  email: string;

  @ApiProperty({
    example: 'token-de-confirmacion-123456',
    description: 'Token único para validar la confirmación de cuenta',
  })
  @IsNotEmpty({ message: 'El token de confirmación es obligatorio' })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  confirmationToken: string;
}
