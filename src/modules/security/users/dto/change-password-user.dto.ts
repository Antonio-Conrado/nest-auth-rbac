import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'NuevaPass123', description: 'Nueva contraseña' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'NuevaPass123',
    description: 'Confirmación de la nueva contraseña',
  })
  @IsString({
    message: 'La confirmación de la contraseña debe ser una cadena de texto',
  })
  @MinLength(6, { message: 'La confirmación debe tener al menos 6 caracteres' })
  passwordConfirmation: string;
}
