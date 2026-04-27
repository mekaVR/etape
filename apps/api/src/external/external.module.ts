import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { ExternalController } from '@external/controllers/external.controller';
import { InseeService } from '@external/services/insee.service';
import { GouvService } from '@external/services/gouv.service';

@Module({
  imports: [AuthModule],
  controllers: [ExternalController],
  providers: [InseeService, GouvService],
})
export class ExternalModule {}
