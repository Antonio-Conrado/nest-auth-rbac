import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';
import { ExceptionPostgres } from './exception-postgress';
import { ErrorLogger } from './error-logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    const type: 'success' | 'info' | 'warning' | 'error' = 'error';

    // Handling specific Postgres errors (conflict)
    const pgError = ExceptionPostgres.duplicateValue(
      exception,
      statusCode,
      message,
    );
    if (pgError) {
      statusCode = pgError.statusCode;
      message = pgError.message;
    }

    if (exception instanceof HttpException) {
      // Handle NestJS exceptions (HttpException)
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object' && 'message' in res) {
        message = (res as { message?: string }).message || message;
      }
    }
    // Other JS/TS errors
    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    if (exception instanceof UnauthorizedException) {
      // Handle UnauthorizedException (customize message for invalid or expired JWT tokens)
      message =
        exception.message && exception.message !== 'Unauthorized'
          ? exception.message
          : 'Token inválido o expirado, por favor inicia sesión de nuevo';
      statusCode = 401;
    }

    // Log the error to the terminal with request method, URL, and filtered stack trace (showing only project files)

    ErrorLogger.log(exception, request, message);
    // Build and send a consistent API response to the client
    const apiResponse: ApiResponseDto = {
      statusCode,
      message,
      data: null,
      type,
    };

    response.status(statusCode).json(apiResponse);
  }
}
