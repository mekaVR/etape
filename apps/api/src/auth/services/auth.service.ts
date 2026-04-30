import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/services/users.service';
import { PasswordService } from '@auth/services/password.service';
import { EmailVerificationService } from '@auth/services/email-verification.service';
import { JwtTokenPayload } from '@auth/interfaces/authenticated-request.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import type { LoginPayload, RegisterPayload } from '@etape/types/schemas/auth';
import { AUTH_ERROR_CODES } from '@etape/types/constants/api-errors';
import { getNumberConfig } from '../../common/config';
import { DEFAULT_REFRESH_TOKEN_MAX_AGE } from '@auth/constants/token.constants';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '@mail/services/mail.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterPayload): Promise<void> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException({
        message: 'La création du compte a échoué',
        fields: { email: 'Cet email est déjà utilisé' },
      });
    }

    const { user, token } = await this.prisma.$transaction(async (tx) => {
      const user = await this.usersService.createUser(registerDto, tx);
      const token = await this.emailVerificationService.createTokenForUser(
        user.id,
        tx,
      );
      return { user, token };
    });

    this.mailService.sendEmailVerification(user.email, token).catch((error) => {
      this.logger.error(
        `Failed to send verification email to ${user.email}`,
        error instanceof Error ? error.stack : undefined,
      );
    });
  }

  async login(loginDto: LoginPayload, res: Response) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await this.passwordService.isValidPassword(
      loginDto.password,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException({
        code: AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED,
        message:
          'Veuillez vérifier votre adresse email avant de vous connecter',
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    await this.usersService.updateLastLogin(user.id);
    return { accessToken: tokens.accessToken };
  }

  async refresh(email: string, res: Response) {
    const user = await this.usersService.findByEmail(email);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  async logout(res: Response) {
    res.clearCookie('refresh_token', this.getRefreshCookieBaseOptions());
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload: JwtTokenPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<StringValue>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<StringValue>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private getRefreshCookieBaseOptions() {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
    };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      ...this.getRefreshCookieBaseOptions(),
      maxAge: getNumberConfig(
        this.config,
        'REFRESH_TOKEN_MAX_AGE',
        DEFAULT_REFRESH_TOKEN_MAX_AGE,
      ),
    });
  }
}
