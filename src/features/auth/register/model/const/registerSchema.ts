import { z } from "zod";

export const REGISTER_SCHEMA = z
  .object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    email: z.email("Некорректный email"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
