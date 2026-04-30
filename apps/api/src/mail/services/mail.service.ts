import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { passwordResetTemplate } from '@mail/templates/password-reset.template';
import { emailVerificationTemplate } from '@mail/templates/email-verification.template';
import { DEFAULT_EMAIL_VERIFICATION_TTL_MS } from '@auth/constants/email-verification.constants';
import { getNumberConfig } from '../../common/config';

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

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL');
    const logoUrl = this.config.get<string>('MAIL_LOGO_URL');
    const from = this.config.get<string>('MAIL_FROM');
    const ttlMs = getNumberConfig(
      this.config,
      'EMAIL_VERIFICATION_TOKEN_TTL_MS',
      DEFAULT_EMAIL_VERIFICATION_TTL_MS,
    );
    const expiresInHours = Math.round(ttlMs / (60 * 60 * 1000));
    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const html = emailVerificationTemplate({
      verifyUrl,
      logoUrl,
      expiresInHours,
    });

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Confirmez votre adresse email — Transition Pro',
      html,
    });

    this.logger.log(`Email verification sent to ${to}`);
  }
}
