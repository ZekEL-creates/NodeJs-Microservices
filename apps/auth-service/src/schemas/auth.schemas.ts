import { z } from "zod/v3";

export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password should be 8 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password should be 8 characters long"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
