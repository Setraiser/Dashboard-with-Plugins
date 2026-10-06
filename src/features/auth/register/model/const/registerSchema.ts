import { z } from "zod";

export const REGISTER_SCHEMA = z
  .object({
    name: z
      .string()
      .min(1, "auth.validation.nameRequired")
      .min(2, "auth.validation.nameTooShort"),
    email: z
      .string()
      .min(1, "auth.validation.emailRequired")
      .pipe(z.email("auth.validation.emailInvalid")),
    password: z
      .string()
      .min(1, "auth.validation.passwordRequired")
      .min(6, "auth.validation.passwordTooShort"),
    confirmPassword: z.string().min(1, "auth.validation.confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.passwordMismatch",
    path: ["confirmPassword"],
  });
