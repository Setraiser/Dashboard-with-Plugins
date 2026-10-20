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
            className="flex min-h-full flex-1 flex-col text-[#282923] [--dashboard-host-tab-border:#d9d5ca] [--dashboard-host-tab-bg:#fbfaf6] [--dashboard-host-tab-text:#36372f] [--dashboard-host-tab-active-border:#a34d36] [--dashboard-host-tab-active-bg:#f3e8e1] [--dashboard-host-tab-active-text:#783d2e] [font-family:var(--font-geist-sans),Arial,Helvetica,sans-serif] antialiased [&_a]:text-inherit [&_a]:no-underline dark:text-[#e9e7df] dark:[--dashboard-host-tab-border:#45473f] dark:[--dashboard-host-tab-bg:#20231e] dark:[--dashboard-host-tab-text:#e9e7df] dark:[--dashboard-host-tab-active-border:#d18468] dark:[--dashboard-host-tab-active-bg:#382a24] dark:[--dashboard-host-tab-active-text:#f0c0aa]"
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
