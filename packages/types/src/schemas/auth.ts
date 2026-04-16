import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Minimum 8 caractères")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      "Doit contenir au moins une lettre et un chiffre",
    ),
});

export const signupFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "..."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
