import { z } from "zod";

export const REGISTER_SCHEMA = z
  .object({
    name: z
      .string()
      .min(1, "Введите имя")
      .min(2, "Имя должно содержать минимум 2 символа"),
    email: z
      .string()
      .min(1, "Введите email")
      .pipe(z.email("Введите корректный email")),
    password: z
      .string()
      .min(1, "Введите пароль")
      .min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
