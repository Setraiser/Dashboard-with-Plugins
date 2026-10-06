"use client";

import { usePluginTabs } from "@/features/plugin-navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbItems } from "../model/functions/getBreadcrumbItems";
import { useLocale, useTranslations } from "next-intl";

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navigation");
  const { tabs } = usePluginTabs(locale);
  const pluginNames = new Map(tabs.map(({ id, displayName }) => [id, displayName]));
  const items = getBreadcrumbItems(pathname, pluginNames, t("dashboard"));

  if (items.length === 0) return null;

  return (
    <nav aria-label={t("breadcrumbLabel")}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-600 sm:text-[15px] dark:text-slate-300">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-1.5" key={`${item.label}-${index}`}>
              {index > 0 && (
                <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-md px-1.5 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="inline-flex items-center rounded-md px-1.5 py-1 font-semibold text-slate-900 dark:text-white"
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
