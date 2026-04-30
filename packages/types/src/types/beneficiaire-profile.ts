import type { Civilite } from "@etape/types/schemas/beneficiaire-profile";

export interface BeneficiaireProfile {
  id: number;
  userId: number;
  civilite: Civilite | null;
  nom: string | null;
  prenom: string | null;
  dateNaissance: string | null;
  lieuNaissance: string | null;
  nationalite: string | null;
  numeroSecuriteSociale: string | null;
  adresseNumero: string | null;
  adresseVoie: string | null;
  adresseComplement: string | null;
  codePostal: string | null;
  ville: string | null;
  telephoneFixe: string | null;
  telephonePortable: string | null;
  datePremierEmploi: string | null;
  createdAt: string;
  updatedAt: string;
}
