export function convertFileToBase64String(file: Express.Multer.File): string {
  if (!file.buffer) {
    throw new Error('El archivo está vacío o no fue cargado correctamente');
  }
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}
