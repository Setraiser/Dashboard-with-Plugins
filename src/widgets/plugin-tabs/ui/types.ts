import type { PluginTabItem } from "@/features/plugin-navigation";

export type { PluginTabItem };

export interface PluginTabsProps {
  items: PluginTabItem[];
  activePluginId: string | null;
}
