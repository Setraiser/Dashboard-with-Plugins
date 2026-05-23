"use client";

import { Component, type ReactNode } from "react";
import type {
  PluginErrorBoundaryProps,
  PluginErrorBoundaryState,
} from "./types";

export class PluginErrorBoundary extends Component<
  PluginErrorBoundaryProps,
  PluginErrorBoundaryState
> {
  state: PluginErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PluginErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error(`Plugin "${this.props.pluginId}" crashed`, error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert">
            Plugin &quot;{this.props.pluginId}&quot; failed to render.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
