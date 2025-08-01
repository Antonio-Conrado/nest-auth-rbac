import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export class IdValidationPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => {
        return new BadRequestException(
          'Validación fallida (se espera una cadena numérica)',
        );
      },
    });
  }
}
