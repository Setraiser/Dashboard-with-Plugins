"use server";

import { isLocale } from "@/host-i18n/locale";
import { cookies } from "next/headers";

export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) {
    throw new Error("Unsupported locale.");
  }

  const cookieStore = await cookies();
  cookieStore.set("dashboard_locale", locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
