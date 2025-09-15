// common/dto/search.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @ApiPropertyOptional({
    example: 'ejemplo',
    description: 'Término de búsqueda para filtrar resultados',
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  term?: string;
}
