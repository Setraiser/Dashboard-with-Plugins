import { isLocale, resolveLocale } from "@/host-i18n/locale";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const savedLocale = cookieStore.get("dashboard_locale")?.value;
  const locale =
    savedLocale && isLocale(savedLocale)
      ? savedLocale
      : resolveLocale(requestHeaders.get("accept-language"));

  return {
    locale,
    messages: (await import(`../host-i18n/messages/${locale}.json`)).default,
  };
});
