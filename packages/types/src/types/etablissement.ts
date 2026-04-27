export interface ApeCode {
  Code: string;
  Libelle: string;
}

export const SIRET_SEARCH_STATUS = {
  IDLE: 100,
  LOADING: 102,
  OK: 200,
  OK_ALT: 201,
  MOVED: 301,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
  UNAVAILABLE: 503,
} as const;

export type SiretSearchStatus =
  (typeof SIRET_SEARCH_STATUS)[keyof typeof SIRET_SEARCH_STATUS];

export type MandatoryField =
  | "raison_sociale"
  | "adresse"
  | "complement_adresse"
  | "code_postal"
  | "ville"
  | "ape"
  | "date_creation"
  | "taille_entreprise";

export interface SireneEtablissementAdresse {
  numeroVoieEtablissement?: string;
  indiceRepetitionEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  complementAdresseEtablissement?: string;
  codePostalEtablissement: string;
  libelleCommuneEtablissement: string;
}

export interface SireneUniteLegale {
  denominationUniteLegale: string;
  activitePrincipaleUniteLegale: string;
  etatAdministratifUniteLegale: "A" | "F";
}

export interface SireneEtablissement {
  siret: string;
  dateCreationEtablissement: string;
  trancheEffectifsEtablissement: string;
  adresseEtablissement: SireneEtablissementAdresse;
  uniteLegale: SireneUniteLegale;
}

export interface SireneApiHeader {
  statut: number;
  message: string;
}

export interface SireneApiResponse {
  header: SireneApiHeader;
  etablissement: SireneEtablissement;
}

export interface EtablissementGouvAnnuel {
  date_derniere_mise_a_jour: string | null;
  value: number | null;
}

// TODO: shape à confirmer quand l'URL de l'API gouv sera choisie
export interface EtablissementGouvResponse {
  data: {
    effectifs_annuel: EtablissementGouvAnnuel[];
  };
}
