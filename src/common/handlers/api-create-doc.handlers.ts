import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiResponseMessages } from './api-response-messages.handlers';

export function ApiCreateDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Crear ${msg.toLowerCase()}` }),
    ApiResponse({ status: 201, description: messages.created }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiConflictResponse({ description: messages.conflict }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiFindAllDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Obtener todos los ${msg.toLowerCase()}s` }),
    ApiResponse({
      status: 200,
      description: `Lista de ${msg.toLowerCase()}s obtenida correctamente`,
    }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiSearchDoc(entity: string) {
  return applyDecorators(
    ApiOperation({ summary: `Buscar ${entity.toLowerCase()}(s)` }),
    ApiQuery({
      name: 'term',
      description: `Término de búsqueda para filtrar ${entity.toLowerCase()}(s)`,
      required: true,
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: `${entity.charAt(0).toUpperCase() + entity.slice(1)}(s) encontrado(s) correctamente`,
    }),
    ApiNotFoundResponse({
      description: `No se encontraron ${entity.toLowerCase()}(s) con ese término`,
    }),
    ApiBadRequestResponse({
      description: 'Parámetro de búsqueda inválido',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error inesperado del servidor',
    }),
  );
}

export function ApiFindOneDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Obtener ${msg.toLowerCase()} por ID` }),
    ApiParam({ name: 'id', description: `ID de ${msg.toLowerCase()}` }),
    ApiResponse({
      status: 200,
      description: `Se encontró ${msg.toLowerCase()} correctamente`,
    }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiUpdateDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Actualizar ${msg.toLowerCase()}` }),
    ApiParam({ name: 'id', description: `ID de ${msg.toLowerCase()}` }),
    ApiResponse({ status: 200, description: messages.updated }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiConflictResponse({ description: messages.conflict }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiToggleStatusDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Activar o suspender ${msg.toLowerCase()}` }),
    ApiParam({ name: 'id', description: `ID de ${msg.toLowerCase()}` }),
    ApiResponse({
      status: 200,
      description: `Estado de ${msg.toLowerCase()} modificado correctamente`,
    }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiDeleteDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Eliminar ${msg.toLowerCase()}` }),
    ApiParam({ name: 'id', description: `ID de ${msg.toLowerCase()}` }),
    ApiResponse({ status: 200, description: messages.removed }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiUpdatePasswordDoc(msg: string) {
  const messages = ApiResponseMessages(msg);
  return applyDecorators(
    ApiOperation({ summary: `Actualizar contraseña de ${msg.toLowerCase()}` }),
    ApiParam({ name: 'id', description: `ID de ${msg.toLowerCase()}` }),
    ApiResponse({ status: 200, description: messages.updated }),
    ApiBadRequestResponse({ description: 'Las contraseñas no coinciden' }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

//AUTH
export function ApiRegisterDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Registrar nuevo usuario' }),
    ApiResponse({ status: 201, description: messages.created }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiConflictResponse({ description: messages.conflict }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

// Login
export function ApiLoginDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiUnauthorizedResponse({ description: 'Credenciales inválidas' }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

export function ApiProfileDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Obtener perfil del usuario autenticado' }),
    ApiResponse({
      status: 200,
      description: 'Perfil del usuario obtenido correctamente',
    }),
    ApiUnauthorizedResponse({
      description: messages.unauthorized,
    }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

// Logout
export function ApiLogoutDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Cerrar sesión' }),
    ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiUnauthorizedResponse({ description: messages.unauthorized }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

// Confirm Account
export function ApiConfirmAccountDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Confirmar cuenta de usuario' }),
    ApiResponse({
      status: 200,
      description: 'Cuenta confirmada correctamente',
    }),
    ApiBadRequestResponse({
      description: 'Token de confirmación inválido o expirado',
    }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

// Forgot Password
export function ApiForgotPasswordDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' }),
    ApiResponse({
      status: 200,
      description: 'Correo de restablecimiento enviado',
    }),
    ApiBadRequestResponse({ description: messages.badRequest }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

// Reset Password
export function ApiResetPasswordDoc() {
  const messages = ApiResponseMessages('el usuario');
  return applyDecorators(
    ApiOperation({ summary: 'Restablecer contraseña' }),
    ApiResponse({
      status: 200,
      description: 'Contraseña restablecida correctamente',
    }),
    ApiBadRequestResponse({
      description: 'Token inválido, expirado o contraseñas no coinciden',
    }),
    ApiNotFoundResponse({ description: messages.notFound }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

//token

export function ApiTokenDoc(title: string) {
  const messages = ApiResponseMessages(title);
  return applyDecorators(
    ApiOperation({
      summary: `Generar un nuevo access token en base a ${title} `,
    }),
    ApiResponse({
      status: 200,
      description: `Token generado correctamente`,
    }),
    ApiNotFoundResponse({ description: `${title} no encontrado` }),
    ApiBadRequestResponse({ description: `${title} inválido o expirado` }),
    ApiInternalServerErrorResponse({
      description: messages.internalServerError,
    }),
  );
}

//upload files
// Upload Image or File
export function ApiUploadFileDoc(message: string, fieldName: string) {
  return applyDecorators(
    ApiOperation({ summary: `Subir archivo` }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: `Extensiones de ${message} esperado (ejemplo: ${
              fieldName === 'image' ? 'jpeg, png, webp, avif' : 'pdf'
            })`,
          },
        },
      },
    }),

    ApiResponse({
      status: 200,
      description: `${message.charAt(0).toUpperCase() + message.slice(1)} se ha subido correctamente`,
    }),
    ApiBadRequestResponse({
      description: 'Archivo no válido o supera el tamaño permitido',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error inesperado del servidor',
    }),
  );
}

export function ApiDeleteFileDoc(message: string) {
  return applyDecorators(
    ApiOperation({ summary: `Eliminar archivo` }),
    ApiResponse({
      status: 200,
      description: `${message.charAt(0).toUpperCase() + message.slice(1)} se eliminó correctamente`,
    }),
    ApiNotFoundResponse({
      description: `${message} no se encontró`,
    }),
    ApiInternalServerErrorResponse({
      description: 'Error inesperado del servidor',
    }),
  );
}
