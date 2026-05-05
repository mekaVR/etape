import type {
  BeneficiaireProfileFormData,
  IdentityFormData,
  ProfessionalFormData,
} from "@etape/types/schemas/beneficiaire-profile";
import type { ContactFormData } from "@etape/types/schemas/beneficiaire-profile";

export const beneficiaireProfileFormDefaultValues: BeneficiaireProfileFormData =
  {
    civilite: undefined,
    nom: "",
    prenom: "",
    dateNaissance: undefined,
    lieuNaissance: "",
    nationalite: undefined,
    numeroSecuriteSociale: "",
    adresseNumero: "",
    adresseVoie: "",
    adresseComplement: "",
    codePostal: "",
    ville: "",
    telephoneFixe: "",
    telephonePortable: "",
    datePremierEmploi: undefined,
  };

export const identityFormDefaultValues: IdentityFormData = {
  civilite: undefined,
  nom: "",
  prenom: "",
  dateNaissance: undefined,
  lieuNaissance: "",
  nationalite: undefined,
  numeroSecuriteSociale: "",
};

export const contactFormDefaultValues: ContactFormData = {
  adresseNumero: "",
  adresseVoie: "",
  adresseComplement: "",
  codePostal: "",
  ville: "",
  telephoneFixe: "",
  telephonePortable: "",
};

export const professionalFormDefaultValues: ProfessionalFormData = {
  datePremierEmploi: undefined,
};
