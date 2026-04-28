import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '@users/services/users.service';
import { PasswordService } from '@auth/services/password.service';
import { MailService } from '@mail/services/mail.service';

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 60 * 60 * 1000;

const GHOST_USER_EMAIL =
  '__system_password_reset_dummy__@transition-pro.internal';
const GHOST_USER_USERNAME = '__system_password_reset_dummy__';

@Injectable()
export class PasswordResetService implements OnModuleInit {
  private readonly logger = new Logger(PasswordResetService.name);
  private ghostUserId!: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit(): Promise<void> {
    const password = await this.passwordService.encryptPassword(
      randomBytes(32).toString('hex'),
    );
    const ghost = await this.prisma.user.upsert({
      where: { email: GHOST_USER_EMAIL },
      create: {
        email: GHOST_USER_EMAIL,
        username: GHOST_USER_USERNAME,
        password,
        role: 'system',
      },
      update: {},
    });
    this.ghostUserId = ghost.id;
  }

  async forgotPassword(email: string): Promise<void> {
    const user =
      email === GHOST_USER_EMAIL
        ? null
        : await this.usersService.findByEmail(email);
    const userId = user?.id ?? this.ghostUserId;

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId, usedAt: null },
    });

    const token = randomBytes(TOKEN_BYTES).toString('hex');
    const tokenHash = this.hashToken(token);

    await this.prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    if (!user) return;

    this.mailService.sendPasswordReset(user.email, token).catch((error) => {
      this.logger.error(
        `Failed to send password reset email to ${user.email}`,
        error instanceof Error ? error.stack : undefined,
      );
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.passwordResetToken.findUnique({
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

    const hashedPassword =
      await this.passwordService.encryptPassword(newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      });
      await tx.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      await tx.passwordResetToken.deleteMany({
        where: { userId: record.userId, id: { not: record.id }, usedAt: null },
      });
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
