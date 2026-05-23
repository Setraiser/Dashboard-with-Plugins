import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppQueryProvider } from "@/app/providers/query-provider";
import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import "./globals.css";
import cls from "./layout.module.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={combineClassNames(geistSans.variable, geistMono.variable)}
    >
      <body>
        <div className={cls.hostRoot}>
          <AppQueryProvider>{children}</AppQueryProvider>
        </div>
      </body>
    </html>
  );
}
