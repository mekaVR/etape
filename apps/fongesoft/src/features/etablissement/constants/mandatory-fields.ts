import type { MandatoryField } from "@etape/types/types/etablissement";

export const MANDATORY_FIELDS: readonly MandatoryField[] = [
  "raison_sociale",
  "adresse",
  "ape",
  "taille_entreprise",
] as const;
