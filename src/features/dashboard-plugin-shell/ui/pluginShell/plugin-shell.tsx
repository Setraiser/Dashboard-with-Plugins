"use client";

import { useDashboardLayoutStore } from "@/features/dashboard-layout/model/layout-store";
import {
  pickActivePluginId,
  usePluginTabs,
} from "@/features/plugin-navigation";
import { pluginDependencies } from "@/plugin-runtime";
import { PluginSlot } from "@/plugin-runtime/ui";
import { PluginTabs } from "@/widgets/plugin-tabs";
import { useEffect, useMemo } from "react";
import cls from "./plugin-shell.module.scss";

export interface PluginShellProps {
  routePluginId?: string;
}

export function PluginShell({ routePluginId }: PluginShellProps) {
  const { tabs, error, isLoading } = usePluginTabs();
  const widgets = useDashboardLayoutStore((state) => state.widgets);
  const setWidgets = useDashboardLayoutStore((state) => state.setWidgets);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/dashboard/layout")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setWidgets(Array.isArray(data?.widgets) ? data.widgets : []);
      })
      .catch(() => {
        if (isMounted) {
          setWidgets([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setWidgets]);

  const activePluginId = useMemo(
    () => pickActivePluginId(routePluginId, tabs),
    [routePluginId, tabs],
  );

  if (error) return <div role="alert">{error}</div>;
  if (isLoading) return <div>Loading plugins...</div>;
  if (!activePluginId) {
    return (
      <main className={cls.root}>
        <PluginTabs items={tabs} activePluginId={activePluginId} />
        <div role="alert">Plugin route was not found.</div>
      </main>
    );
  }

  const layoutWidget = widgets.find((widget) => widget.pluginId === activePluginId);
  const plugin = layoutWidget
    ? {
      instanceId: layoutWidget.instanceId,
      pluginId: layoutWidget.pluginId,
    }
    : {
      instanceId: `${activePluginId}-main-1`,
      pluginId: activePluginId
    };

  return (
    <main className={cls.root}>
      <PluginTabs items={tabs} activePluginId={activePluginId} />
      <PluginSlot plugin={plugin} dependencies={pluginDependencies} />
    </main>
  );
}

export default PluginShell;
