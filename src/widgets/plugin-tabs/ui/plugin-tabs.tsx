"use client";

import Link from "next/link";
import { combineClassNames } from "@/shared/lib/utils/combineClassNames/combine-class-names";
import type { PluginTabsProps } from "./types";
import cls from "./plugin-tabs.module.scss";

export function PluginTabs({ items, activePluginId }: PluginTabsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Plugin navigation">
      <ul className={cls.list}>
        {items.map((item) => {
          const isActive = item.id === activePluginId;
          return (
            <li key={item.id}>
              <Link
                href={`/${item.id}`}
                className={combineClassNames(cls.link, {
                  [cls.linkActive]: isActive,
                })}
              >
                {item.displayName}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
