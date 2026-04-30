import { z } from "zod";
import { nationalitesList } from "@etape/types/schemas/nationalites";

const numeroSecuRegex = /^[12]\d{14}$/;
const codePostalRegex = /^\d{5}$/;
const telephoneRegex = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;

export const civiliteSchema = z.enum(["MADAME", "MONSIEUR"]);

export const beneficiaireProfileSchema = z.object({
  civilite: civiliteSchema.optional(),
  nom: z.string().min(1).optional(),
  prenom: z.string().min(1).optional(),
  dateNaissance: z.coerce.date().optional(),
  lieuNaissance: z.string().min(1).optional(),
  nationalite: z.enum(nationalitesList).optional(),
  numeroSecuriteSociale: z
    .string()
    .regex(numeroSecuRegex, "Numéro de sécurité sociale invalide (15 chiffres)")
    .optional(),
  adresseNumero: z.string().min(1).optional(),
  adresseVoie: z.string().min(1).optional(),
  adresseComplement: z.string().optional(),
  codePostal: z
    .string()
    .regex(codePostalRegex, "Code postal invalide (5 chiffres)")
    .optional(),
  ville: z.string().min(1).optional(),
  telephoneFixe: z
    .string()
    .regex(telephoneRegex, "Numéro de téléphone invalide")
    .optional(),
  telephonePortable: z
    .string()
    .regex(telephoneRegex, "Numéro de téléphone invalide")
    .optional(),
  datePremierEmploi: z.coerce.date().optional(),
});

export const dossierCompletSchema = beneficiaireProfileSchema
  .required({
    nom: true,
    prenom: true,
    dateNaissance: true,
    lieuNaissance: true,
    numeroSecuriteSociale: true,
    datePremierEmploi: true,
  })
  .refine((data) => !!data.telephoneFixe || !!data.telephonePortable, {
    message: "Au moins un numéro de téléphone est requis",
    path: ["telephonePortable"],
  });

export type Civilite = z.infer<typeof civiliteSchema>;
export type BeneficiaireProfilePayload = z.infer<
  typeof beneficiaireProfileSchema
>;
export type DossierCompletPayload = z.infer<typeof dossierCompletSchema>;
