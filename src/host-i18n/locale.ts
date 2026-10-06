export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferredLanguages = acceptLanguage
    .split(",")
    .map((entry) => {
      const [language = "", quality = "q=1"] = entry.trim().split(";");
      const q = Number(quality.trim().replace(/^q=/, ""));

      return {
        language: language.toLowerCase(),
        quality: Number.isFinite(q) ? q : 0,
      };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of preferredLanguages) {
    const locale = locales.find(
      (supported) => language === supported || language.startsWith(`${supported}-`),
    );
    if (locale) return locale;
  }

  return defaultLocale;
}
