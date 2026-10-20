import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PluginTabsProps } from "./types";

export function PluginTabs({ items, activePluginId }: PluginTabsProps) {
  const t = useTranslations("navigation");
  if (items.length === 0) return null;

  return (
    <nav aria-label={t("pluginNavigationLabel")}>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isActive = item.id === activePluginId;
          return (
            <li key={item.id}>
              <Link
                href={`/dashboard/${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={combineClassNames(
                  "group flex min-h-36 flex-col justify-between gap-8 rounded-md border border-(--dashboard-host-tab-border) border-t-2 border-t-transparent bg-(--dashboard-host-tab-bg) p-5 text-(--dashboard-host-tab-text) no-underline transition-colors duration-150 hover:border-(--dashboard-host-tab-active-border) hover:border-t-(--dashboard-host-tab-active-border) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dashboard-host-tab-active-border) motion-reduce:transition-none",
                  {
                    "border-(--dashboard-host-tab-active-border) border-t-(--dashboard-host-tab-active-border) bg-(--dashboard-host-tab-active-bg) text-(--dashboard-host-tab-active-text)":
                      isActive,
                  },
                )}
              >
                <span className="flex items-start justify-between gap-4 text-lg font-semibold tracking-tight">
                  {item.displayName}
                  <span aria-hidden="true" className="text-base text-[#8d4935] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-[#d18468]">↗</span>
                </span>
                <span className="max-w-[28ch] text-sm leading-6 text-(--dashboard-host-tab-text) opacity-75">
                  {item.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
