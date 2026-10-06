import { AppQueryProvider } from "@/app/providers/query-provider";
import { ErrorNotificationProvider } from "@/app/providers/error-notifications";
import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations("metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale} className={combineClassNames(geistSans.variable)}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div
            className="flex min-h-full flex-1 flex-col text-slate-800 [--dashboard-host-tab-border:#d9e1ee] [--dashboard-host-tab-bg:#ffffffcc] [--dashboard-host-tab-text:#334155] [--dashboard-host-tab-active-border:#6366f1] [--dashboard-host-tab-active-bg:#eef2ff] [--dashboard-host-tab-active-text:#4338ca] [font-family:var(--font-geist-sans),Arial,Helvetica,sans-serif] antialiased [&_a]:text-inherit [&_a]:no-underline dark:text-slate-100 dark:[--dashboard-host-tab-border:#334155] dark:[--dashboard-host-tab-bg:#0f172acc] dark:[--dashboard-host-tab-text:#e2e8f0] dark:[--dashboard-host-tab-active-border:#818cf8] dark:[--dashboard-host-tab-active-bg:#312e8133] dark:[--dashboard-host-tab-active-text:#c7d2fe]"
          >
            <ErrorNotificationProvider>
              <AppQueryProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </AppQueryProvider>
            </ErrorNotificationProvider>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
