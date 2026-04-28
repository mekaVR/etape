import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { passwordResetTemplate } from '@mail/templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL');
    const logoUrl = this.config.get<string>('MAIL_LOGO_URL');
    const from = this.config.get<string>('MAIL_FROM');
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const html = passwordResetTemplate({ resetUrl, logoUrl });

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html,
    });

    this.logger.log(`Password reset email sent to ${to}`);
  }
}
