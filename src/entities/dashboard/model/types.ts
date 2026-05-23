export interface DashboardLayoutDto {
  id: string;
  widgets: Array<{
    instanceId: string;
    pluginId: string;
    slot: "dashboard.main" | "dashboard.sidebar";
    config: Record<string, unknown>;
  }>;
}
