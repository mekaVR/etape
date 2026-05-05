import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { BeneficiaireProfilePayload } from '@etape/types/schemas/beneficiaire-profile';
import { isUniqueConstraintOn } from '../../prisma/prisma-errors';

@Injectable()
export class BeneficiaireProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.beneficiaireProfile.findUnique({
      where: { userId },
    });
  }

  async upsertProfile(userId: number, data: BeneficiaireProfilePayload) {
    try {
      return await this.prisma.beneficiaireProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
      });
    } catch (error) {
      if (isUniqueConstraintOn(error, 'numeroSecuriteSociale')) {
        throw new ConflictException({
          message: 'La mise à jour du profil a échoué',
          fields: {
            numeroSecuriteSociale:
              'Ce numéro de sécurité sociale est déjà utilisé',
          },
        });
      }
      throw error;
    }
  }
}
