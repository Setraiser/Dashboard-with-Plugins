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
      className="inline-flex shrink-0 items-center border border-[#c9c5ba] p-0.5 dark:border-[#55574e]"
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
          className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
            locale === option
              ? "bg-[#a34d36] text-white"
              : "text-[#686960] hover:bg-[#ebe8df] dark:text-[#b4b4aa] dark:hover:bg-[#292c27]"
          }`}
        >
          {localeLabels[option]}
        </button>
      ))}
    </nav>
  );
}
