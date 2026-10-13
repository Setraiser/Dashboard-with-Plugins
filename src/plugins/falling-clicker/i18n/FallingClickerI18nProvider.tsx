import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import enMessages from "./messages/en.json";
import ruMessages from "./messages/ru.json";

/** Сводит языковые теги и варианты с подчёркиванием к поддерживаемой локали. */
function resolveLocale(locale?: string): "en" | "ru" {
  return locale?.trim().toLowerCase().split(/[-_]/, 1)[0] === "ru"
    ? "ru"
    : "en";
}

/** Предоставляет переводы виджету и задаёт lang для его DOM-поддерева. */
export function FallingClickerI18nProvider({
  locale,
  children,
}: {
  locale?: string;
  children: ReactNode;
}) {
  const resolvedLocale = resolveLocale(locale);
  const messages = resolvedLocale === "ru" ? ruMessages : enMessages;

  return (
    <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
      <div lang={resolvedLocale}>{children}</div>
    </NextIntlClientProvider>
  );
}
