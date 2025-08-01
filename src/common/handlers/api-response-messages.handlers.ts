export const ApiResponseMessages = (msg: string) => ({
  created: `Se creó correctamente ${msg.toLowerCase()}`,
  badRequest: 'Solicitud incorrecta, los datos proporcionados son inválidos',
  conflict: `Conflicto: ya existe ${msg.toLowerCase()} en la base de datos`,
  internalServerError:
    'Error interno del servidor, por favor intenta más tarde',
  unauthorized: 'No tiene autorización para realizar esta acción',
  removed: `Se eliminó correctamente ${msg.toLowerCase()}`,
  updated: `Se actualizó correctamente ${msg.toLowerCase()}`,
  notFound: `No se encontró ${msg.toLowerCase()}`,
  suspended: `Se suspendió correctamente ${msg.toLowerCase()}`,
  activated: `Se activó correctamente ${msg.toLowerCase()}`,
  deactivated: `${msg.toLowerCase()} está suspendido.`,
});

export const ApiResponseSuspendOrActivate = (msg: string, status: boolean) => {
  const message = status
    ? ApiResponseMessages(msg).activated
    : ApiResponseMessages(msg).suspended;

  return message;
};
