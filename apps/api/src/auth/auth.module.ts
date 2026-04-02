import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { PasswordService } from '@auth/services/password.service';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { RefreshStrategy } from '@auth/strategies/refresh.strategy';
import { UsersModule } from '@users/users.module';
import { StringValue } from 'ms';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<StringValue>('JWT_EXPIRES_IN', '15m'),
                },
            }),
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, PasswordService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
