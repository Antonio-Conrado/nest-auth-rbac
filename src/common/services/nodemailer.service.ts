import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('SMTP_SERVICE'),
      host: this.configService.get('SMTP_HOST'),
      port: +this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      tls: {
        ciphers: 'TLSv1.2,TLSv1.3',
      },
    });
  }

  async sendMail(
    to: string,
    type: 'account-confirmation' | 'forgot-password',
    context: Record<string, any>,
  ) {
    let subject = '';
    let text = '';

    switch (type) {
      case 'account-confirmation':
        subject = 'Confirma tu cuenta';
        text = `
          Hola ${context.name},

          Por favor confirma tu cuenta haciendo clic en el siguiente enlace:

          ${this.configService.get('FRONTEND_URL')}/auth/confirm-account?email=${context.email}&confirmationToken=${context.confirmationToken}

          Si no solicitaste esta acción, puedes ignorar este correo.
      `;
        break;

      case 'forgot-password':
        subject = 'Restablece tu contraseña';
        text = `
          Hola ${context.name},

          Para restablecer tu contraseña, haz clic en el siguiente enlace:

          ${this.configService.get('FRONTEND_URL')}/auth/reset-password?email=${context.email}&resetPasswordToken=${context.resetPasswordToken}

          Este enlace es válido por 1 hora.

          Si no solicitaste este cambio, ignora este correo.
      `;
        break;

      default:
        subject = 'Notificación';
        text = 'Tienes un nuevo mensaje.';
    }

    await this.transporter.sendMail({
      from: `"My App" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject,
      text,
    });
  }
}
