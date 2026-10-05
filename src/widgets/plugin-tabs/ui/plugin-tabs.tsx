"use client";

import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import Link from "next/link";
import type { PluginTabsProps } from "./types";

export function PluginTabs({ items, activePluginId }: PluginTabsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Plugin navigation">
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isActive = item.id === activePluginId;
          return (
            <li key={item.id}>
              <Link
                href={`/dashboard/${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={combineClassNames(
                  "flex min-h-23 flex-col justify-center gap-2 rounded-xl border border-(--dashboard-host-tab-border) bg-(--dashboard-host-tab-bg) p-4 text-(--dashboard-host-tab-text) no-underline transition duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dashboard-host-tab-active-border) motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  {
                    "border-(--dashboard-host-tab-active-border) bg-(--dashboard-host-tab-active-bg) text-(--dashboard-host-tab-active-text)":
                      isActive,
                  },
                )}
              >
                <span className="text-base font-semibold">{item.displayName}</span>
                <span className="text-sm text-(--dashboard-host-tab-text) opacity-75">
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
