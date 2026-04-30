import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@auth/interfaces/authenticated-request.interface';
import { BeneficiaireProfileService } from '@users/services/beneficiaire-profile.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  beneficiaireProfileSchema,
  type BeneficiaireProfilePayload,
} from '@etape/types/schemas/beneficiaire-profile';

@UseGuards(JwtAuthGuard)
@Controller('users/me/profile')
export class BeneficiaireProfileController {
  constructor(private readonly service: BeneficiaireProfileService) {}

  @Get()
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.service.getProfile(req.user.id);
  }

  @Patch()
  upsertProfile(
    @Request() req: AuthenticatedRequest,
    @Body(new ZodValidationPipe(beneficiaireProfileSchema))
    dto: BeneficiaireProfilePayload,
  ) {
    return this.service.upsertProfile(req.user.id, dto);
  }
}
