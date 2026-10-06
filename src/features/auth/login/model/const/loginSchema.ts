import { z } from "zod";
export const LOGIN_SCHEMA = z.object({
  email: z
    .string()
    .min(1, "auth.validation.emailRequired")
    .pipe(z.email("auth.validation.emailInvalid")),
  password: z
    .string()
    .min(1, "auth.validation.passwordRequired")
    .min(6, "auth.validation.passwordTooShort"),
});

export type LoginFormData = z.infer<typeof LOGIN_SCHEMA>;
