import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email("Email invalide").optional(),
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
