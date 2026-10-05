"use client";


import { useLoadedPlugin } from "../../model/hooks/use-loaded-plugin";

import type { PluginSlotProps } from "../../model/types/plugin-slot";
import { PluginErrorBoundary } from "../plugin-error-boundary";
import { LoadingState } from "@/shared/ui/loading-state";
import sandboxCls from "./plugin-slot.module.scss";

export function PluginSlot({ plugin, dependencies }: PluginSlotProps) {
  const { module, error, isLoading } = useLoadedPlugin(plugin.pluginId);

  if (isLoading) return <LoadingState label="Loading plugin..." />;
  if (error) return <div role="alert">{error}</div>;
  if (!module) return <LoadingState label="Loading plugin..." />;

  const pluginDependencies = dependencies[plugin.pluginId];

  return (
    <PluginErrorBoundary pluginId={plugin.pluginId}>
      <div
        className={sandboxCls.sandbox}
        data-plugin-runtime-mount={plugin.pluginId}
      >
        <module.Widget
          pluginDependencies={(pluginDependencies ?? {}) as Record<string, unknown>}
          instanceId={plugin.instanceId}
          config={plugin.config}
        />
      </div>
    </PluginErrorBoundary>
  );
}
