import { ClockWidget } from "./widgets/clock-widget/ui/clock-widget/clock-widget";
import { clockConfigSchema } from "./entities/clock/config/clock-config-schema/clock-config-schema";
import type { PluginModule } from "@/plugin-runtime/types";

const clockPlugin: PluginModule = {
  manifest: {
    id: "clock",
    version: "1.0.0",
    apiVersion: "1.0.0",
    displayName: "Clock",
    slots: ["dashboard.main", "dashboard.sidebar"],
    permissions: ["dashboard:read"],
    configSchema: clockConfigSchema,
  },
  Widget: ClockWidget,
};

export default clockPlugin;
