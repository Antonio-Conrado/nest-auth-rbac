import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  email: string;

  @ApiProperty({
    example: 'MiContraseña123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la sesión debe ser recordada (persistente)',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo remember debe ser un booleano' })
  remember?: boolean;
}
