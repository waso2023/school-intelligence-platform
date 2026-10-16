import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please provide a valid school email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RoleSwitchSchema = z.object({
  targetRole: z.enum([
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "PRINCIPAL",
    "TEACHER",
    "FINANCE_OFFICER",
    "RECEPTIONIST",
    "PARENT",
    "STUDENT",
    "DRIVER",
  ]),
});
