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
import { LoginDto } from '@auth/dto/login.dto';
import { RegisterDto } from '@auth/dto/register.dto';
import { AuthenticatedRequest } from '@auth/interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(loginDto, res);
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
