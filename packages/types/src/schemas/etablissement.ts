import { z } from "zod";

export const etatEtablissementSchema = z.enum(["A", "F"]);

export const tailleEntrepriseCodeSchema = z.enum([
  "NN",
  "00",
  "01",
  "02",
  "03",
  "11",
  "12",
  "21",
  "22",
  "31",
  "32",
  "41",
  "42",
  "51",
  "52",
  "53",
]);

export const etablissementSchema = z
  .object({
    siret: z.string().regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres"),
    raison_sociale: z.string().min(1, "La raison sociale est requise"),
    adresse: z.string().min(1, "L'adresse est requise"),
    complement_adresse: z.string(),
    code_postal: z
      .string()
      .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres")
      .or(z.literal("")),
    ville: z.string(),
    ape: z
      .string()
      .min(1, "Le code APE est requis")
      .regex(/^\d{4}[A-Z]$/, "Code APE invalide (ex : 6201Z)"),
    date_creation: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
      .or(z.literal("")),
    taille_entreprise: z.union([tailleEntrepriseCodeSchema, z.literal("")]),
    effectif_moyen: z.number().int().nonnegative(),
    etat: etatEtablissementSchema.or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.taille_entreprise === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taille_entreprise"],
        message: "La taille de l'entreprise est requise",
      });
    }
  });

export type EtablissementPayload = z.infer<typeof etablissementSchema>;
export type EtatEtablissement = z.infer<typeof etatEtablissementSchema>;
export type TailleEntrepriseCode = z.infer<typeof tailleEntrepriseCodeSchema>;
