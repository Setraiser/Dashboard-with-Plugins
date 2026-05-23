import { create } from "zustand";

interface DashboardWidget {
  instanceId: string;
  pluginId: string;
  slot: "dashboard.main" | "dashboard.sidebar";
}

interface DashboardLayoutState {
  widgets: DashboardWidget[];
  setWidgets: (widgets: DashboardWidget[]) => void;
}

export const useDashboardLayoutStore = create<DashboardLayoutState>((set) => ({
  widgets: [],
  setWidgets: (widgets) => set({ widgets }),
}));
