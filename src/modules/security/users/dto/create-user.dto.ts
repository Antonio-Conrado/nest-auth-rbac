import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  MinLength,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Length(1, 100, {
    message: 'El apellido debe tener entre 1 y 100 caracteres',
  })
  surname: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email único',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    example: 'SuperSecret123!',
    description: 'Contraseña del usuario',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({ example: '+50512345678', description: 'Teléfono' })
  @IsOptional()
  @Matches(/^\+505[578]\d{7}$/, {
    message:
      'El número debe incluir el código de país +505 y comenzar con 5, 7 u 8 seguido de 7 dígitos',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telephone?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del rol asignado al usuario',
  })
  @IsNumber({}, { message: 'El rol debe ser un número entero' })
  roleId: number;
}
