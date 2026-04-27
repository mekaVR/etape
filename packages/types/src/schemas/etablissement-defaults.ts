import type { EtablissementPayload } from "./etablissement";

export const etablissementDefaultValues: EtablissementPayload = {
  siret: "",
  raison_sociale: "",
  adresse: "",
  complement_adresse: "",
  code_postal: "",
  ville: "",
  ape: "",
  date_creation: "",
  taille_entreprise: "",
  effectif_moyen: 0,
  etat: "",
};
