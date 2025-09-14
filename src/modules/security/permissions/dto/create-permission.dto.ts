import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description:
      'Identificador único del permiso (usado en guards y lógica del backend)',
    example: 'user.create',
    nullable: false,
  })
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del permiso no puede estar vacío.' })
  name: string;

  @ApiProperty({
    description: 'Nombre legible del permiso para la interfaz de usuario',
    example: 'Crear usuario',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description: string;
}
