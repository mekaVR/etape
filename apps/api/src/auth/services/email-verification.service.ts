import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '@users/services/users.service';
import { PasswordService } from '@auth/services/password.service';
import { MailService } from '@mail/services/mail.service';
import { DEFAULT_EMAIL_VERIFICATION_TTL_MS } from '@auth/constants/email-verification.constants';

const TOKEN_BYTES = 32;
const GHOST_USER_EMAIL =
  '__system_password_reset_dummy__@transition-pro.internal';

@Injectable()
export class EmailVerificationService implements OnModuleInit {
  private readonly logger = new Logger(EmailVerificationService.name);
  private ghostUserId!: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const password = await this.passwordService.encryptPassword(
      randomBytes(32).toString('hex'),
    );
    const ghost = await this.prisma.user.upsert({
      where: { email: GHOST_USER_EMAIL },
      create: {
        email: GHOST_USER_EMAIL,
        password,
        role: 'system',
        cguAcceptedAt: new Date(0),
      },
      update: {},
    });
    this.ghostUserId = ghost.id;
  }

  async sendVerification(userId: number, email: string): Promise<void> {
    const token = await this.createTokenForUser(userId);
    this.mailService.sendEmailVerification(email, token).catch((error) => {
      this.logger.error(
        `Failed to send verification email to ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
    });
  }

  async resendVerification(email: string): Promise<void> {
    const user =
      email === GHOST_USER_EMAIL
        ? null
        : await this.usersService.findByEmail(email);
    const userId = user?.id ?? this.ghostUserId;

    const token = await this.createTokenForUser(userId);

    if (!user || user.emailVerifiedAt) return;

    this.mailService.sendEmailVerification(user.email, token).catch((error) => {
      this.logger.error(
        `Failed to send verification email to ${user.email}`,
        error instanceof Error ? error.stack : undefined,
      );
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (
      !record ||
      record.usedAt ||
      record.expiresAt < new Date() ||
      record.userId === this.ghostUserId
    ) {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      });
      await tx.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: record.userId,
          id: { not: record.id },
          usedAt: null,
        },
      });
    });
  }

  private async createTokenForUser(userId: number): Promise<string> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId, usedAt: null },
    });
    const token = randomBytes(TOKEN_BYTES).toString('hex');
    const tokenHash = this.hashToken(token);
    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + this.getTtlMs()),
      },
    });
    return token;
  }

  private getTtlMs(): number {
    return this.config.get<number>(
      'EMAIL_VERIFICATION_TOKEN_TTL_MS',
      DEFAULT_EMAIL_VERIFICATION_TTL_MS,
    );
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
