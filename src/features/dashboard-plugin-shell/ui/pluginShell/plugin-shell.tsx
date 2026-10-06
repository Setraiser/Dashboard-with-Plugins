"use client";

import {
  pickActivePluginId,
  usePluginTabs,
} from "@/features/plugin-navigation";
import { useReportOperationError } from "@/app/providers/error-notifications";
import { pluginDependencies } from "@/plugin-runtime";
import { PluginSlot } from "@/plugin-runtime/ui";
import { LoadingState } from "@/shared/ui/loading-state";
import { useMemo } from "react";
import cls from "./plugin-shell.module.scss";
import { useLocale, useTranslations } from "next-intl";

export interface PluginShellProps {
  routePluginId?: string;
}

export function PluginShell({ routePluginId }: PluginShellProps) {
  const locale = useLocale();
  const t = useTranslations("runtime");
  const { tabs, error, isLoading } = usePluginTabs(locale);
  const reportOperationError = useReportOperationError();

  const activePluginId = useMemo(
    () => pickActivePluginId(routePluginId, tabs),
    [routePluginId, tabs],
  );

  if (error) return <div role="alert">{t("navigationFailed")}</div>;
  if (isLoading) return <LoadingState label={t("loadingPlugins")} />;
  if (!activePluginId) {
    return (
      <main className={cls.root}>
        <div role="alert">{t("pluginNotFound")}</div>
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
      <PluginSlot
        plugin={plugin}
        dependencies={dependencies}
        locale={locale}
        loadingLabel={t("loadingPlugin")}
        errorLabel={t("applicationError")}
        pluginErrorLabel={t("pluginFailed")}
      />
    </main>
  );
}

export default PluginShell;
