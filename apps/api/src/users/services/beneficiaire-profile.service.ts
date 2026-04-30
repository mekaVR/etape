import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { BeneficiaireProfilePayload } from '@etape/types/schemas/beneficiaire-profile';

@Injectable()
export class BeneficiaireProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.beneficiaireProfile.findUnique({
      where: { userId },
    });
  }

  async upsertProfile(userId: number, data: BeneficiaireProfilePayload) {
    return this.prisma.beneficiaireProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
