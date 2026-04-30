import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from '@users/controllers/users.controller';
import { BeneficiaireProfileController } from '@users/controllers/beneficiaire-profile.controller';
import { BeneficiaireProfileService } from '@users/services/beneficiaire-profile.service';
import { UsersService } from '@users/services/users.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [UsersController, BeneficiaireProfileController],
  providers: [UsersService, BeneficiaireProfileService],
  imports: [forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
