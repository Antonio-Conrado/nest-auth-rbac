import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Cantidad de elementos a retornar',
  })
  @IsOptional()
  @IsPositive({ message: 'El límite debe ser un número positivo' })
  @Type(() => Number)
  take?: number;

  @ApiProperty({
    default: 0,
    description: 'Cantidad de elementos a omitir (paginación)',
  })
  @IsOptional()
  @Min(0, { message: 'El skip no puede ser menor que 0' })
  @Type(() => Number)
  skip?: number;
}
