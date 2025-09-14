export const ApiResponseMessages = (msg: string) => ({
  found: `Se encontró correctamente ${msg.toLowerCase()}`,
  created: `Se creó correctamente ${msg.toLowerCase()}`,
  registerUser: `Se creó correctamente ${msg.toLowerCase()}.Por favor, revise su correo electrónico para confirmar su cuenta.`,
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
  cannotDeactivateSuperAdmin:
    'No se puede desactivar a un usuario con rol de superadministrador por razones de seguridad.',
  onlySuperAdminAllowed:
    'Esta acción solo puede ser realizada por el superadministrador por razones de seguridad.',
});

export const ApiResponseSuspendOrActivate = (msg: string, status: boolean) => {
  const message = status
    ? ApiResponseMessages(msg).activated
    : ApiResponseMessages(msg).suspended;

  return message;
};
