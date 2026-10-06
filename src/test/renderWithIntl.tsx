import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import enMessages from "../host-i18n/messages/en.json";
import ruMessages from "../host-i18n/messages/ru.json";
import type { Locale } from "../host-i18n/locale";

const messages = { en: enMessages, ru: ruMessages };

export function renderWithIntl(
  ui: ReactElement,
  {
    locale = "en",
    ...renderOptions
  }: RenderOptions & { locale?: Locale } = {},
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {ui}
    </NextIntlClientProvider>,
    renderOptions,
  );
}
