import { Module } from '@nestjs/common';
import { exceptionFilter } from './exceptions/exception-filter';
import { MailService } from './services/nodemailer.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  providers: [exceptionFilter, MailService, CloudinaryService],
  exports: [exceptionFilter, MailService, CloudinaryService],
})
export class CommonModule {}
