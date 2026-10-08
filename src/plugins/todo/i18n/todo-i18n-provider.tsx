import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import enMessages from "./messages/en.json";
import ruMessages from "./messages/ru.json";

function resolveTodoLocale(locale?: string): "en" | "ru" {
  const language = locale?.trim().toLowerCase().split(/[-_]/, 1)[0];
  return language === "ru" ? "ru" : "en";
}

export function TodoI18nProvider({
  locale,
  children,
}: {
  locale?: string;
  children?: ReactNode;
}) {
  const resolvedLocale = resolveTodoLocale(locale);
  const messages = resolvedLocale === "ru" ? ruMessages : enMessages;

  return (
    <NextIntlClientProvider
      locale={resolvedLocale}
      messages={messages}
      getMessageFallback={() => messages.common.errors.generic}
    >
      <div lang={resolvedLocale}>{children}</div>
    </NextIntlClientProvider>
  );
}
