"use client";


import { useLoadedPlugin } from "../../model/hooks/use-loaded-plugin";

import type { PluginSlotProps } from "../../model/types/plugin-slot";
import { PluginErrorBoundary } from "../plugin-error-boundary";
import { LoadingState } from "@/shared/ui/loading-state";
import sandboxCls from "./plugin-slot.module.scss";

export function PluginSlot({
  plugin,
  dependencies,
  locale,
  loadingLabel,
  errorLabel,
  pluginErrorLabel,
}: PluginSlotProps) {
  const { module, error, isLoading } = useLoadedPlugin(plugin.pluginId);

  if (isLoading) return <LoadingState label={loadingLabel} />;
  if (error) return <div role="alert">{errorLabel}</div>;
  if (!module) return <LoadingState label={loadingLabel} />;

  const pluginDependencies = dependencies[plugin.pluginId];

  return (
    <PluginErrorBoundary pluginId={plugin.pluginId} fallback={<div role="alert">{pluginErrorLabel}</div>}>
      <div
        className={sandboxCls.sandbox}
        data-plugin-runtime-mount={plugin.pluginId}
      >
        <module.Widget
          pluginDependencies={(pluginDependencies ?? {}) as Record<string, unknown>}
          instanceId={plugin.instanceId}
          config={plugin.config}
          locale={locale}
        />
      </div>
    </PluginErrorBoundary>
  );
}
