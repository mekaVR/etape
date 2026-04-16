import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
