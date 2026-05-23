import type { PluginTabItem } from "../types/types";

export function pickActivePluginId(
  routePluginId: string | undefined,
  tabs: PluginTabItem[],
): string | null {
  if (tabs.length === 0) return null;
  if (!routePluginId) return tabs[0].id;
  return tabs.some((tab) => tab.id === routePluginId) ? routePluginId : null;
}
