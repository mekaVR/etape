import type { BeneficiaireProfilePayload } from "./beneficiaire-profile";

export const beneficiaireProfileDefaultValues: BeneficiaireProfilePayload = {
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
