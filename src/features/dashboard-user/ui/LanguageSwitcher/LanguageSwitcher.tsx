"use client";

import { setLocale } from "@/app/actions/set-locale";
import { locales, type Locale } from "@/host-i18n/locale";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <nav
      aria-label={t("languageSwitcher")}
      className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-white/70 p-0.5 dark:border-slate-700 dark:bg-slate-800/70"
    >
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-label={t(option === "en" ? "switchToEnglish" : "switchToRussian")}
          aria-pressed={locale === option}
          disabled={isPending}
          onClick={() => changeLocale(option)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            locale === option
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {localeLabels[option]}
        </button>
      ))}
    </nav>
  );
}
