import { Logger } from '@nestjs/common';
import { Request } from 'express';

export class ErrorLogger {
  private static readonly logger = new Logger(ErrorLogger.name);
  static log(exception: unknown, request: Request, message: string) {
    // Build the base log message with method and URL
    let logMessage = `Error in [${request.method} ${request.url}]: ${message}`;

    if (exception instanceof Error && exception.stack) {
      // Get the first line of the stack up to the first '('
      const functionLine = exception.stack.split('(')[0].trim();

      // Append to the log: "Details in Stack trace:" in yellow, functionLine in red
      logMessage += `. \n\x1b[33mDetails in Stack trace:\x1b[0m \x1b[31m${functionLine}\x1b[0m`;
    }

    // Log the complete message
    this.logger.error(logMessage);
  }
}
