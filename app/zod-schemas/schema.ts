import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Username cannot be empty" })
    .trim()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, { message: "Password cannot be empty" }),
  redirectTo: z.string(),
  remember: z.string().optional(),
});