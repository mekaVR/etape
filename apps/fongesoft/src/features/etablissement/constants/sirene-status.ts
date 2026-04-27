import type { SiretSearchStatus } from "@etape/types/types/etablissement";

export const SIRENE_STATUS_MESSAGES: Record<SiretSearchStatus, string> = {
  100: "Veuillez saisir un n° de SIRET valide pour lancer la recherche dans la base Sirene",
  102: "Recherche des informations dans la base Sirene...",
  200: "Établissement trouvé. Les données de la base Sirene sont disponibles",
  201: "Établissement trouvé. Les données de la base Sirene sont disponibles",
  301: "Établissement d'une unité légale fermée pour cause de doublon",
  400: "Nombre incorrect de paramètres ou les paramètres sont mal formatés",
  401: "Jeton d'accès manquant ou invalide",
  403: "Droits insuffisants pour consulter les données de cette unité",
  404: "Établissement non trouvé dans la base Sirene",
  406: "Le paramètre 'Accept' de l'en-tête HTTP contient une valeur non prévue",
  429: "Quota d'interrogations de l'API dépassé",
  500: "Erreur interne du serveur",
  503: "Service indisponible",
};
