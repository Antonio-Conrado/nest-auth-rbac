import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class exceptionFilter {
  private readonly logger = new Logger();

  catch(error): never {
    const simpleMessage: unknown =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      error?.toString()?.split('\n')[0] || 'Error desconocido';

    // Lo imprime sin el stack trace
    this.logger.error(simpleMessage);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (error.detail && error.detail.includes('Key')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const match = error.detail.match(/=\((.*?)\)/);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const valorDuplicado = match ? match[1] : null;

        const mensaje = valorDuplicado
          ? `El dato ${valorDuplicado} ya existe en la base de datos`
          : 'El dato ya existe en la base de datos';

        throw new ConflictException(mensaje);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new ConflictException(error.detail);
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(simpleMessage);
  }
}
