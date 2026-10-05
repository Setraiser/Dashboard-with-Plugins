"use client";

import {
  pickActivePluginId,
  usePluginTabs,
} from "@/features/plugin-navigation";
import { useReportOperationError } from "@/app/providers/error-notifications";
import { pluginDependencies } from "@/plugin-runtime";
import { PluginSlot } from "@/plugin-runtime/ui";
import { useMemo } from "react";
import cls from "./plugin-shell.module.scss";

export interface PluginShellProps {
  routePluginId?: string;
}

export function PluginShell({ routePluginId }: PluginShellProps) {
  const { tabs, error, isLoading } = usePluginTabs();
  const reportOperationError = useReportOperationError();

  const activePluginId = useMemo(
    () => pickActivePluginId(routePluginId, tabs),
    [routePluginId, tabs],
  );

  if (error) return <div role="alert">{error}</div>;
  if (isLoading) return <div>Loading plugins...</div>;
  if (!activePluginId) {
    return (
      <main className={cls.root}>
        <div role="alert">Plugin route was not found.</div>
      </main>
    );
  }

  const plugin = {
    instanceId: `${activePluginId}-main-1`,
    pluginId: activePluginId,
  };
  const dependencies = {
    ...pluginDependencies,
    todo: {
      ...pluginDependencies.todo,
      reportOperationError,
    },
  };

  return (
    <main className={cls.root}>
      <PluginSlot plugin={plugin} dependencies={dependencies} />
    </main>
  );
}

export default PluginShell;
