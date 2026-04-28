import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from '@auth/services/auth.service';
import { AuthenticatedRequest } from '@auth/interfaces/authenticated-request.interface';
import {
  ForgotPasswordPayload,
  forgotPasswordSchema,
  LoginPayload,
  loginSchema,
  RegisterPayload,
  registerSchema,
  ResetPasswordPayload,
  resetPasswordSchema,
} from '@etape/types/schemas/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { PasswordResetService } from '@auth/services/password-reset.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterPayload,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginPayload,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req.user.id, req.user.email, res);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema))
    dto: ForgotPasswordPayload,
  ) {
    return this.passwordResetService.forgotPassword(dto.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordPayload,
  ) {
    return this.passwordResetService.resetPassword(dto.token, dto.password);
  }
}
