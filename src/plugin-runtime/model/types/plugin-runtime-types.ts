import { ReactNode } from "react";

export const PLUGIN_API_VERSION = "1.0.0";

export interface PluginConfigSchema {
  parse: (input: unknown) => unknown;
}

export interface PluginManifest {
  id: string;
  version: string;
  displayName: string;

  configSchema?: PluginConfigSchema;
}

export interface PluginWidgetProps {
  instanceId: string;
  config: unknown;
  pluginDependencies: Record<string, unknown>;
}

export interface PluginLifecycle {
  /**
   * Called when the plugin module is unloaded from the host.
   * This is for module-level singleton resources only.
   * Instance-level cleanup must live in the widget/store that owns it.
   */
  dispose?: () => void;
}

export interface PluginModule extends PluginLifecycle {
  manifest: PluginManifest;
  Widget: (props: PluginWidgetProps) => ReactNode;
}

export interface PluginInstanceConfig {
  pluginId: string;
  instanceId: string;
  config?: unknown;
  props?: Record<string, unknown>;
}

export type PluginLoader = () => Promise<{ default: PluginModule }>;

/* 

interface PluginManifest {
  id: string;
  version: string;
  displayName: string;
}

interface PluginModule {
  manifest: PluginManifest;
  Widget: React.ComponentType;
}
*/
