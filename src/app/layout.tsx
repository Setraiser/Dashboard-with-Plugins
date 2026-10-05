import { AppQueryProvider } from "@/app/providers/query-provider";
import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Plugin Dashboard",
  description: "Learning-oriented plugin dashboard host",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={combineClassNames(geistSans.variable)}>
      <body>
        <div
          className="flex-1 flex min-h-full flex-col bg-white text-[#171717] [--dashboard-host-tab-border:#d1d5db] [--dashboard-host-tab-bg:#ffffff] [--dashboard-host-tab-text:#111827] [--dashboard-host-tab-active-border:#2563eb] [--dashboard-host-tab-active-bg:#eff6ff] [--dashboard-host-tab-active-text:#1d4ed8] [font-family:var(--font-geist-sans),Arial,Helvetica,sans-serif] antialiased [&_a]:text-inherit [&_a]:no-underline dark:bg-[#0a0a0a] dark:text-[#ededed] dark:[--dashboard-host-tab-border:#374151] dark:[--dashboard-host-tab-bg:#111827] dark:[--dashboard-host-tab-text:#f3f4f6] dark:[--dashboard-host-tab-active-border:#3b82f6] dark:[--dashboard-host-tab-active-bg:#1e3a8a33] dark:[--dashboard-host-tab-active-text:#93c5fd]"
        >
          <AppQueryProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </AppQueryProvider>
        </div>
      </body>
    </html>
  );
}
