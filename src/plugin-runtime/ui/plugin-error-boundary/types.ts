import type { ReactNode } from "react";

export interface PluginErrorBoundaryProps {
  pluginId: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export interface PluginErrorBoundaryState {
  hasError: boolean;
}
