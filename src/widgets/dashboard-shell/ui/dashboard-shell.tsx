"use client";

import { useEffect } from "react";
import { useDashboardLayoutStore } from "@/features/dashboard-layout/model/layout-store";
import { initDefaultRegistry } from "@/plugin-runtime/default-registry";
import { PluginSlot } from "@/plugin-runtime/ui";

export function DashboardShell() {
  const widgets = useDashboardLayoutStore((state) => state.widgets);
  const setWidgets = useDashboardLayoutStore((state) => state.setWidgets);

  useEffect(() => {
    initDefaultRegistry();
    setWidgets([
      {
        instanceId: "clock-main-1",
        pluginId: "clock",
        slot: "dashboard.main",
      },
    ]);
  }, [setWidgets]);

  return (
    <section>
      {widgets.map((widget) => (
        <PluginSlot
          key={widget.instanceId}
          plugin={{
            instanceId: widget.instanceId,
            pluginId: widget.pluginId,
            slot: widget.slot,
            config: { title: "Local time" },
          }}
        />
      ))}
    </section>
  );
}
