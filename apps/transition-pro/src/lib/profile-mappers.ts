import type { BeneficiaireProfile } from "@etape/types/types/beneficiaire-profile";
import type {
  ContactFormData,
  IdentityFormData,
  ProfessionalFormData,
} from "@etape/types/schemas/beneficiaire-profile";

export function mapProfileToForm(
  profile: BeneficiaireProfile,
): IdentityFormData {
  return {
    civilite: profile.civilite ?? undefined,
    nom: profile.nom ?? "",
    prenom: profile.prenom ?? "",

    dateNaissance: profile.dateNaissance
      ? new Date(profile.dateNaissance)
      : undefined,
    lieuNaissance: profile.lieuNaissance ?? "",
    nationalite: profile.nationalite ?? undefined,
    numeroSecuriteSociale: profile.numeroSecuriteSociale ?? "",
  };
}

export function mapContactToForm(
  profile: BeneficiaireProfile,
): ContactFormData {
  return {
    adresseNumero: profile.adresseNumero ?? "",
    adresseVoie: profile.adresseVoie ?? "",
    adresseComplement: profile.adresseComplement ?? "",
    codePostal: profile.codePostal ?? "",
    ville: profile.ville ?? "",
    telephoneFixe: profile.telephoneFixe ?? "",
    telephonePortable: profile.telephonePortable ?? "",
  };
}

export function mapProfessionalToForm(
  profile: BeneficiaireProfile,
): ProfessionalFormData {
  return {
    datePremierEmploi: profile.datePremierEmploi
      ? new Date(profile.datePremierEmploi)
      : undefined,
  };
}
