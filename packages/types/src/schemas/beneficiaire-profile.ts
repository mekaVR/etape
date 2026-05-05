import { z } from "zod";
import { nationalitesList } from "@etape/types/schemas/nationalites";

const numeroSecuRegex = /^[12]\d{14}$/;
const codePostalRegex = /^\d{5}$/;
const telephoneRegex = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;

export const civiliteSchema = z.enum(["MADAME", "MONSIEUR"]);

const optionalPattern = (regex: RegExp, message: string) =>
  z
    .string()
    .refine((v) => v === "" || regex.test(v), message)
    .optional();

const baseFields = {
  civilite: civiliteSchema.optional(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  lieuNaissance: z.string().optional(),
  nationalite: z.enum(nationalitesList).optional(),
  numeroSecuriteSociale: optionalPattern(
    numeroSecuRegex,
    "Numéro de sécurité sociale invalide (15 chiffres)",
  ),
  adresseNumero: z.string().optional(),
  adresseVoie: z.string().optional(),
  adresseComplement: z.string().optional(),
  codePostal: optionalPattern(
    codePostalRegex,
    "Code postal invalide (5 chiffres)",
  ),
  ville: z.string().optional(),
  telephoneFixe: optionalPattern(
    telephoneRegex,
    "Numéro de téléphone invalide",
  ),
  telephonePortable: optionalPattern(
    telephoneRegex,
    "Numéro de téléphone invalide",
  ),
};

// API: accepte string ISO ou Date (validation des requêtes backend)
export const beneficiaireProfileSchema = z.object({
  ...baseFields,
  dateNaissance: z.coerce.date().optional(),
  datePremierEmploi: z.coerce.date().optional(),
});

// Form: travaille avec Date directement (compatible RHF)
export const beneficiaireProfileFormSchema = z.object({
  ...baseFields,
  dateNaissance: z.date().optional(),
  datePremierEmploi: z.date().optional(),
});

// Dossier complet (côté backend, validation finale)
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

// Schémas par section (form-side)
export const identityFormSchema = beneficiaireProfileFormSchema
  .pick({
    civilite: true,
    nom: true,
    prenom: true,
    dateNaissance: true,
    lieuNaissance: true,
    nationalite: true,
    numeroSecuriteSociale: true,
  })
  .superRefine((data, ctx) => {
    if (!data.nom) {
      ctx.addIssue({
        code: "custom",
        message: "Le nom est requis",
        path: ["nom"],
      });
    }
    if (!data.prenom) {
      ctx.addIssue({
        code: "custom",
        message: "Le prénom est requis",
        path: ["prenom"],
      });
    }
    if (!data.dateNaissance) {
      ctx.addIssue({
        code: "custom",
        message: "La date de naissance est requise",
        path: ["dateNaissance"],
      });
    }
    if (!data.lieuNaissance) {
      ctx.addIssue({
        code: "custom",
        message: "Le lieu de naissance est requis",
        path: ["lieuNaissance"],
      });
    }
    if (!data.numeroSecuriteSociale) {
      ctx.addIssue({
        code: "custom",
        message: "Le numéro de sécurité sociale est requis",
        path: ["numeroSecuriteSociale"],
      });
    }
  });

export const contactFormSchema = beneficiaireProfileFormSchema.pick({
  adresseNumero: true,
  adresseVoie: true,
  adresseComplement: true,
  codePostal: true,
  ville: true,
  telephoneFixe: true,
  telephonePortable: true,
});

export const professionalFormSchema = beneficiaireProfileFormSchema.pick({
  datePremierEmploi: true,
});

export type Civilite = z.infer<typeof civiliteSchema>;
export type BeneficiaireProfilePayload = z.infer<
  typeof beneficiaireProfileSchema
>;
export type BeneficiaireProfileFormData = z.infer<
  typeof beneficiaireProfileFormSchema
>;
export type DossierCompletPayload = z.infer<typeof dossierCompletSchema>;
export type IdentityFormData = z.infer<typeof identityFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProfessionalFormData = z.infer<typeof professionalFormSchema>;
