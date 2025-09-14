import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre único del rol',
    example: 'empleado',
    nullable: false,
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del rol no puede estar vacío.' })
  name: string;
}
