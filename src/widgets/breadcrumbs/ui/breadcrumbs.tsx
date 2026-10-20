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
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#686960] sm:text-[15px] dark:text-[#b4b4aa]">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-1.5" key={`${item.label}-${index}`}>
              {index > 0 && (
                <span className="text-[#aaa79d] dark:text-[#6c6e64]" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center px-1.5 py-1 font-medium text-[#686960] transition-colors hover:text-[#8d4935] dark:text-[#b4b4aa] dark:hover:text-[#e4aa91]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="inline-flex items-center px-1.5 py-1 font-semibold text-[#282923] dark:text-[#f0eee7]"
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
