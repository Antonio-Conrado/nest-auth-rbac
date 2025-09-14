export class ExceptionPostgres {
  static duplicateValue(
    exception: unknown,
    statusCode = 500,
    message = 'Ya existe un registro con este valor en la base de datos.',
  ): { statusCode: number; message: string } {
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as { code?: string }).code === '23505'
    ) {
      statusCode = 409;
      const detail = (exception as { detail?: string }).detail;
      const match = detail?.match(/=\((.*?)\)/);
      const duplicatedValue = match ? match[1] : null;

      message = duplicatedValue
        ? `El dato: ${duplicatedValue} ya existe en la base de datos y no se permiten valores duplicados.`
        : 'Ya existe un registro con este valor en la base de datos y no se permiten valores duplicados.';
    }

    return { statusCode, message };
  }
}
