import type { TailleEntrepriseCode } from "@etape/types/schemas/etablissement";

export interface TailleEntrepriseOption {
  codeInsee: TailleEntrepriseCode;
  code: string;
  tranche: string;
  libelle: string;
}

export const TAILLE_ENTREPRISE_OPTIONS: readonly TailleEntrepriseOption[] = [
  {
    codeInsee: "NN",
    code: "",
    tranche: "Non-employeuse",
    libelle: "Unité non-employeuse",
  },
  { codeInsee: "00", code: "00", tranche: "0", libelle: "0 salarié" },
  {
    codeInsee: "01",
    code: "01",
    tranche: "1 ou 2",
    libelle: "1 ou 2 salariés",
  },
  { codeInsee: "02", code: "01", tranche: "3 - 5", libelle: "3 à 5 salariés" },
  { codeInsee: "03", code: "01", tranche: "6 - 9", libelle: "6 à 9 salariés" },
  {
    codeInsee: "11",
    code: "02",
    tranche: "10 - 19",
    libelle: "10 à 19 salariés",
  },
  {
    codeInsee: "12",
    code: "03",
    tranche: "20 - 49",
    libelle: "20 à 49 salariés",
  },
  {
    codeInsee: "21",
    code: "04",
    tranche: "50 - 99",
    libelle: "50 à 99 salariés",
  },
  {
    codeInsee: "22",
    code: "04",
    tranche: "100 - 199",
    libelle: "100 à 199 salariés",
  },
  {
    codeInsee: "31",
    code: "05",
    tranche: "200 - 249",
    libelle: "200 à 249 salariés",
  },
  {
    codeInsee: "32",
    code: "05",
    tranche: "250 - 499",
    libelle: "250 à 499 salariés",
  },
  {
    codeInsee: "41",
    code: "06",
    tranche: "500 - 999",
    libelle: "500 à 999 salariés",
  },
  {
    codeInsee: "42",
    code: "06",
    tranche: "1000 - 1999",
    libelle: "1000 à 1999 salariés",
  },
  {
    codeInsee: "51",
    code: "07",
    tranche: "2000 - 4999",
    libelle: "2000 à 4999 salariés",
  },
  {
    codeInsee: "52",
    code: "07",
    tranche: "5000 - 9999",
    libelle: "5000 à 9999 salariés",
  },
  {
    codeInsee: "53",
    code: "07",
    tranche: ">= 10000",
    libelle: "10000 salariés et plus",
  },
] as const;
