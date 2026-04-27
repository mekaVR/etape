import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { InseeService } from '@external/services/insee.service';
import { GouvService } from '@external/services/gouv.service';

@UseGuards(JwtAuthGuard)
@Controller('external')
export class ExternalController {
  constructor(
    private readonly inseeService: InseeService,
    private readonly gouvService: GouvService,
  ) {}

  @Get('sirene/:siret')
  getSirene(@Param('siret') siret: string) {
    return this.inseeService.getSiret(siret);
  }

  @Get('etablissement-effectif/:siret')
  getEtablissementEffectif(@Param('siret') siret: string) {
    return this.gouvService.getEffectif(siret);
  }
}
