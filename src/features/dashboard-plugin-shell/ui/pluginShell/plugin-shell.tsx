"use client";

import {
  pickActivePluginId,
  usePluginTabs,
} from "@/features/plugin-navigation";
import { pluginDependencies } from "@/plugin-runtime";
import { PluginSlot } from "@/plugin-runtime/ui";
import { PluginTabs } from "@/widgets/plugin-tabs";
import { useMemo } from "react";
import cls from "./plugin-shell.module.scss";

export interface PluginShellProps {
  routePluginId?: string;
}

export function PluginShell({ routePluginId }: PluginShellProps) {
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
            config: { title: "Local time" },
          }}
          dependencies={pluginDependencies}
        />
      )}
    </main>
  );
}

export default PluginShell;
