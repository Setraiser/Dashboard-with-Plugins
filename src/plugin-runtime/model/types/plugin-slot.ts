import { PluginInstanceConfig } from "./plugin-runtime-types";

export interface PluginSlotProps {
  plugin: PluginInstanceConfig;
  dependencies: Record<string, unknown>;
  locale?: string;
  loadingLabel: string;
  errorLabel: string;
  pluginErrorLabel: string;
}
