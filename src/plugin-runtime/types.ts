import type { ReactNode } from "react";

export const PLUGIN_API_VERSION = "1.0.0";

export type PluginSlot = "dashboard.main" | "dashboard.sidebar";

export type PluginPermission =
  | "dashboard:read"
  | "dashboard:write"
  | "plugin:data:read"
  | "plugin:data:write";

export interface PluginConfigSchema {
  parse: (input: unknown) => unknown;
}

export interface PluginManifest {
  id: string;
  version: string;
  apiVersion: string;
  displayName: string;
  slots: PluginSlot[];
  permissions?: PluginPermission[];
  configSchema?: PluginConfigSchema;
}

export interface PluginHostApi {
  logger: {
    info: (message: string, meta?: Record<string, unknown>) => void;
    warn: (message: string, meta?: Record<string, unknown>) => void;
    error: (message: string, meta?: Record<string, unknown>) => void;
  };
  navigate: (href: string) => void;
  getUser: () => { id: string; role: string } | null;
  hasPermission: (permission: PluginPermission) => boolean;
  request: <T>(input: RequestInfo | URL, init?: RequestInit) => Promise<T>;
  emitEvent: (
    eventName: string,
    payload?: Record<string, unknown>,
  ) => void;
}

export interface PluginWidgetProps {
  instanceId: string;
  config: unknown;
  host: PluginHostApi;
}

export interface PluginModule {
  manifest: PluginManifest;
  Widget: (props: PluginWidgetProps) => ReactNode;
  dispose?: () => void;
}

export interface PluginInstanceConfig {
  pluginId: string;
  instanceId: string;
  slot: PluginSlot;
  config: unknown;
}

export type PluginLoader = () => Promise<{ default: PluginModule }>;
