import { z } from "zod";
export const LOGIN_SCHEMA = z.object({
  email: z
    .string()
    .min(1, "Введите email")
    .pipe(z.email("Введите корректный email")),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

export type LoginFormData = z.infer<typeof LOGIN_SCHEMA>;
