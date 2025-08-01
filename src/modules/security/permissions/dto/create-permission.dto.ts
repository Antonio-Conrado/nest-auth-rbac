import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Nombre único de permiso',
    example: 'crear usuario, editar usuario, suspender usuario',
    nullable: false,
  })
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del permiso no puede estar vacío.' })
  name: string;

  @ApiProperty({
    description: 'Estado del permiso (activo o inactivo)',
    nullable: true,
  })
  @IsOptional()
  status: boolean;
}
