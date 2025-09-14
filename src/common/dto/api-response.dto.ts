import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    example: 'Operación realizada con éxito',
    description: 'Mensaje de la respuesta',
  })
  message: string;

  @ApiProperty({ description: 'Datos devueltos por la API' })
  data: T | null;

  @ApiProperty({
    example: 'success',
    description: 'Tipo de mensaje: success, info, warning, error',
  })
  type: 'success' | 'info' | 'warning' | 'error';

  @ApiProperty({ example: 200, description: 'Código de estado HTTP' })
  statusCode: number;
}
