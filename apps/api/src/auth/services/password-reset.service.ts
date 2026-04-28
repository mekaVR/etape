import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '@users/services/users.service';
import { PasswordService } from '@auth/services/password.service';
import { MailService } from '@mail/services/mail.service';

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const token = randomBytes(TOKEN_BYTES).toString('hex');
    const tokenHash = this.hashToken(token);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    await this.mailService.sendPasswordReset(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
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
