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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(registerDto: RegisterPayload): Promise<void> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException({
        message: 'La création du compte a échoué',
        fields: { email: 'Cet email est déjà utilisé' },
      });
    }
    const user = await this.usersService.createUser(registerDto);
    await this.emailVerificationService.sendVerification(user.id, user.email);
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
        code: 'EMAIL_NOT_VERIFIED',
        message:
          'Veuillez vérifier votre adresse email avant de vous connecter',
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    await this.usersService.updateLastLogin(user.id);
    return { accessToken: tokens.accessToken };
  }

  async refresh(userId: number, email: string, res: Response) {
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
      maxAge: this.config.get<number>('REFRESH_TOKEN_MAX_AGE'),
    });
  }
}
