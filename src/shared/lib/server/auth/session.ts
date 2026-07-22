import { prisma } from "@/shared/lib/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "./constants";
import { generateSessionToken } from "./crypto";

export async function createSession(userId: string): Promise<string> {
  // 1. Генерируем уникальный токен
  const token = generateSessionToken();

  // 2. Вычисляем время истечения
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // 3. Получаем метаданные запроса (опционально, для безопасности)
  // В Server Actions можно получить через headers()

  // 4. Сохраняем сессию в БД
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  // 5. Устанавливаем куку с токеном
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // JavaScript не может прочитать куку (защита от XSS)
    secure: process.env.NODE_ENV === "production", // Только HTTPS в продакшене
    sameSite: "lax", // Защита от CSRF
    expires: expiresAt, // Время жизни куки = время жизни сессии
    path: "/", // Кука доступна на всём сайте
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    // 1. Удаляем сессию из БД
    await prisma.session.delete({
      where: { token },
    });

    // 2. Удаляем куку у клиента
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // Устанавливаем дату в прошлое — браузер удалит куку
      path: "/",
    });
  }
}
