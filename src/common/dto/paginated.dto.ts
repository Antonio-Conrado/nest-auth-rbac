import { ApiProperty } from '@nestjs/swagger';
import { ApiPaginatedMetaDto } from './api-paginated-meta.dto';

export class PaginatedDto<T> {
  @ApiProperty({ isArray: true, description: 'Items de la página' })
  items: T[];

  @ApiProperty({
    type: () => ApiPaginatedMetaDto,
    description: 'Información de paginación',
  })
  meta: ApiPaginatedMetaDto;
}
