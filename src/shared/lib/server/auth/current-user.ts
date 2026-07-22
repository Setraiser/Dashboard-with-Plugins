import { prisma } from "@/shared/lib/server";
import { cookies } from "next/headers";
import { cache } from "react";
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "./constants";
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  // 1. Ищем сессию в БД по токену
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  // 2. Проверяем, что сессия существует и не истекла
  if (!session || session.expiresAt < new Date()) {
    // Если сессия истекла, удаляем её
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  // 3. (Опционально) Продлеваем сессию, если осталось мало времени
  // Например, если осталось меньше 3 дней, продлеваем на 7 дней
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
  if (session.expiresAt.getTime() - Date.now() < threeDaysInMs) {
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + SESSION_DURATION_DAYS);

    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: newExpiresAt },
    });

    // Обновляем куку
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: newExpiresAt,
      path: "/",
    });
  }

  // 4. Возвращаем пользователя
  return session.user;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    // Импортируем динамически, чтобы избежать ошибок в клиентских компонентах
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }

  return user;
}
