import { randomBytes } from "crypto";

// Генерируем безопасный случайный токен
export function generateSessionToken(): string {
  // 32 байта = 64 символа в hex
  return randomBytes(32).toString("hex");
}
