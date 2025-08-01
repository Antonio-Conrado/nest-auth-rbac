import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ];
    const docMimeTypes = [
      'application/pdf'];

    const maxSize = 3 * 1024 * 1024; // 3MB

    // Put @UseInterceptors(FileInterceptor('image')) or @UseInterceptors(FileInterceptor('file')) above your controller method.

    if (file.fieldname === 'image') {
      if (!imageMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Formato de imagen no válido. Solo se permiten: jpeg, png, webp, avif',
        );
      }
    } else if (file.fieldname === 'file') {
      if (!docMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Formato de archivo no válido. Solo se permite: pdf',
        );
      }
    } else {
      throw new BadRequestException('Campo de archivo inesperado');
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo excede el tamaño máximo permitido de 3MB',
      );
    }

    return file;
  }
}
