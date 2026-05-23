"use client";

import { useMemo } from "react";
import { createPluginHostApi } from "../../host-api";
import { useLoadedPlugin } from "../../model/use-loaded-plugin";
import { validateConfig } from "../../validation";
import { PluginErrorBoundary } from "../plugin-error-boundary";
import sandboxCls from "./plugin-slot.module.scss";
import type { PluginSlotProps } from "./types";

export function PluginSlot({ plugin }: PluginSlotProps) {
  const { module, error, isLoading } = useLoadedPlugin(plugin.pluginId);

  const host = useMemo(
    () =>
      createPluginHostApi({
        getUser: () => ({ id: "demo-user", role: "admin" }),
        hasPermission: () => true,
        navigate: (href) => {
          window.location.assign(href);
        },
      }),
    [],
  );

  if (isLoading) return <div>Loading plugin...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!module) return <div>Loading plugin...</div>;

  const safeConfig = validateConfig(module.manifest, plugin.config);

  return (
    <PluginErrorBoundary pluginId={plugin.pluginId}>
      <div
        className={sandboxCls.sandbox}
        data-plugin-runtime-mount={plugin.pluginId}
      >
        <module.Widget
          instanceId={plugin.instanceId}
          config={safeConfig}
          host={host}
        />
      </div>
    </PluginErrorBoundary>
  );
}
