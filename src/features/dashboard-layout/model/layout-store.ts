import { create } from "zustand";

export interface DashboardWidget {
  instanceId: string;
  pluginId: string;
  slot?: string;
  config?: Record<string, unknown>;
}

interface DashboardLayoutState {
  widgets: DashboardWidget[];
  setWidgets: (widgets: DashboardWidget[]) => void;
}

export const useDashboardLayoutStore = create<DashboardLayoutState>((set) => ({
  widgets: [],
  setWidgets: (widgets) => set({ widgets }),
}));
