import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt, ArrayUnique } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Array de IDs de permisos a asignar',
    type: [Number],
    example: [10, 15, 20],
  })
  @IsArray({ message: 'Los permisos deben estar en un array' })
  @ArrayNotEmpty({ message: 'Los permisos no deben estar vacíos' })
  @ArrayUnique({ message: 'Los permisos deben ser únicos' })
  @IsInt({ each: true })
  permissionIds: number[];
}
