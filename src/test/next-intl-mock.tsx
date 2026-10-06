import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface IntlContextValue {
  locale: string;
  messages: Record<string, unknown>;
  getMessageFallback?: (input: {
    namespace?: string;
    key: string;
    error: Error;
  }) => string;
}

const IntlContext = createContext<IntlContextValue>({
  locale: "en",
  messages: {},
});

export function NextIntlClientProvider({
  locale,
  messages,
  getMessageFallback,
  children,
}: IntlContextValue & { children: ReactNode }) {
  return (
    <IntlContext.Provider
      value={{ locale, messages, getMessageFallback }}
    >
      {children}
    </IntlContext.Provider>
  );
}

export function useLocale(): string {
  return useContext(IntlContext).locale;
}

export function useTranslations(namespace?: string) {
  const { messages, getMessageFallback } = useContext(IntlContext);

  return (key: string, values: Record<string, string | number> = {}) => {
    const fullKey = [namespace, key].filter(Boolean).join(".");
    const message = fullKey
      .split(".")
      .reduce<unknown>(
        (current, segment) =>
          typeof current === "object" && current !== null && segment in current
            ? (current as Record<string, unknown>)[segment]
            : undefined,
        messages,
      );

    if (typeof message !== "string") {
      if (getMessageFallback) {
        return getMessageFallback({
          namespace,
          key,
          error: new Error(`Missing translation: ${fullKey}`),
        });
      }

      throw new Error(`Missing test translation: ${fullKey}`);
    }

    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      Object.prototype.hasOwnProperty.call(values, name)
        ? String(values[name])
        : placeholder,
    );
  };
}
