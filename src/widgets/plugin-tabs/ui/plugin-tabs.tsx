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
                  "group relative flex min-h-28 flex-col justify-center gap-2 overflow-hidden rounded-2xl border border-(--dashboard-host-tab-border) bg-(--dashboard-host-tab-bg) p-5 text-(--dashboard-host-tab-text) no-underline shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-1 hover:border-(--dashboard-host-tab-active-border) hover:shadow-xl hover:shadow-indigo-950/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dashboard-host-tab-active-border) motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  {
                    "border-(--dashboard-host-tab-active-border) bg-(--dashboard-host-tab-active-bg) text-(--dashboard-host-tab-active-text)":
                      isActive,
                  },
                )}
              >
                <span className="flex items-center justify-between text-base font-semibold tracking-tight">
                  {item.displayName}
                  <span aria-hidden="true" className="text-lg text-indigo-500 transition-transform group-hover:translate-x-1">↗</span>
                </span>
                <span className="text-sm leading-6 text-(--dashboard-host-tab-text) opacity-75">
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
