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
  LoginPayload,
  loginSchema,
  RegisterPayload,
  registerSchema,
} from '@etape/types/schemas/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
