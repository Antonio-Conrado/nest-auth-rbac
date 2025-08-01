import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message =
      exception.message && exception.message !== 'Unauthorized'
        ? exception.message
        : 'Token inválido o expirado, por favor inicia sesión de nuevo';

    response.status(401).json({
      statusCode: 401,
      message,
    });
  }
}
