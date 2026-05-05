import { useMyProfile } from "./use-my-profile";

export type ProfileSection = "identity" | "contact" | "professional";

const isFilled = (value: string | null | undefined): boolean =>
  value !== null && value !== undefined && value !== "";

export function useProfileCompletion(): Record<ProfileSection, boolean> {
  const { data: profile } = useMyProfile();

  if (!profile) {
    return { identity: false, contact: false, professional: false };
  }

  return {
    identity:
      isFilled(profile.civilite) &&
      isFilled(profile.nom) &&
      isFilled(profile.prenom) &&
      isFilled(profile.dateNaissance) &&
      isFilled(profile.lieuNaissance) &&
      isFilled(profile.nationalite) &&
      isFilled(profile.numeroSecuriteSociale),
    contact:
      isFilled(profile.adresseNumero) &&
      isFilled(profile.adresseVoie) &&
      isFilled(profile.codePostal) &&
      isFilled(profile.ville) &&
      (isFilled(profile.telephoneFixe) || isFilled(profile.telephonePortable)),
    professional: isFilled(profile.datePremierEmploi),
  };
}
