import { Module } from '@nestjs/common';
import { MailService } from './services/nodemailer.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  providers: [MailService, CloudinaryService],
  exports: [MailService, CloudinaryService],
})
export class CommonModule {}
