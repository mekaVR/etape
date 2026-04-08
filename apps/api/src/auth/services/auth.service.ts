import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/services/users.service';
import { PasswordService } from '@auth/services/password.service';
import { LoginDto } from '@auth/dto/login.dto';
import { RegisterDto } from '@auth/dto/register.dto';
import { JwtTokenPayload } from '@auth/interfaces/authenticated-request.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }
    const user = await this.usersService.createUser(registerDto);
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.username,
      user.role,
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  async login(loginDto: LoginDto, res: Response) {
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

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.username,
      user.role,
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  async refresh(userId: number, email: string, res: Response) {
    const user = await this.usersService.findByEmail(email);
    const tokens = await this.generateTokens(
      userId,
      email,
      user.username,
      user.role,
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  async logout(res: Response) {
    res.clearCookie('refresh_token');
  }

  private async generateTokens(
    userId: number,
    email: string,
    username: string,
    role: string,
  ) {
    const payload: JwtTokenPayload = { sub: userId, email, username, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<StringValue>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<StringValue>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.config.get<number>('REFRESH_TOKEN_MAX_AGE'),
    });
  }
}
