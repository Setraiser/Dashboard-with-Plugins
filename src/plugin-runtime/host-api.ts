"use client";

import type { PluginHostApi } from "./types";
import type { HostApiOptions } from "./host-api.types";

export function createPluginHostApi(options: HostApiOptions): PluginHostApi {
  return {
    logger: {
      info(message: string, meta?: Record<string, unknown>) {
        console.info(`[plugin] ${message}`, meta ?? {});
      },
      warn(message: string, meta?: Record<string, unknown>) {
        console.warn(`[plugin] ${message}`, meta ?? {});
      },
      error(message: string, meta?: Record<string, unknown>) {
        console.error(`[plugin] ${message}`, meta ?? {});
      },
    },
    navigate: options.navigate,
    getUser: options.getUser,
    hasPermission: options.hasPermission,
    async request<T>(input: RequestInfo | URL, init?: RequestInit) {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error(`Plugin request failed: ${response.status}`);
      }
      return (await response.json()) as T;
    },
    emitEvent(eventName: string, payload?: Record<string, unknown>) {
      window.dispatchEvent(
        new CustomEvent(`dashboard:plugin:${eventName}`, {
          detail: payload ?? {},
        }),
      );
    },
  };
}
