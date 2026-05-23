"use client";

import { useMemo } from "react";
import {
  pickActivePluginId,
  usePluginTabs,
} from "@/features/plugin-navigation";
import { PluginSlot } from "@/plugin-runtime/ui";
import { PluginTabs } from "@/widgets/plugin-tabs";
import type { PluginPageProps } from "./types";
import cls from "./plugin-page.module.scss";

export function PluginPage({ routePluginId }: PluginPageProps) {
  const { tabs, error, isLoading } = usePluginTabs();

  const activePluginId = useMemo(
    () => pickActivePluginId(routePluginId, tabs),
    [routePluginId, tabs],
  );

  if (error) return <div role="alert">{error}</div>;
  if (isLoading) return <div>Loading plugins...</div>;

  return (
    <main className={cls.root}>
      <PluginTabs items={tabs} activePluginId={activePluginId} />

      {!activePluginId ? (
        <div role="alert">Plugin route was not found.</div>
      ) : (
        <PluginSlot
          plugin={{
            instanceId: `${activePluginId}-main-1`,
            pluginId: activePluginId,
            slot: "dashboard.main",
            config: { title: "Local time" },
          }}
        />
      )}
    </main>
  );
}
