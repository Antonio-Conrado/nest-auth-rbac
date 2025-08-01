import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico asociado a la cuenta',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Token de restablecimiento de 6 dígitos',
  })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @Matches(/^\d{6}$/, {
    message: 'El token debe contener exactamente 6 dígitos',
  })
  resetPasswordToken: string;

  @ApiProperty({
    example: 'NuevaContraseña123',
    description: 'Nueva contraseña (mínimo 6 caracteres)',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'NuevaContraseña123',
    description: 'Confirmación de la nueva contraseña',
  })
  @IsNotEmpty({ message: 'La confirmación es obligatoria' })
  @MinLength(6, {
    message: 'La confirmación de la contraseña debe tener mínimo 6 caracteres',
  })
  passwordConfirm: string;
}
