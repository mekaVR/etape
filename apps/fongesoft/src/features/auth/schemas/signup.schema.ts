import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "Doit contenir au moins une lettre et un chiffre",
      ),
    confirmPassword: z.string().min(1, "Confirmez le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
