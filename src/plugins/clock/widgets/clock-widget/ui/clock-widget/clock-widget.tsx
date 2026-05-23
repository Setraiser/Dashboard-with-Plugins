"use client";

import type { PluginWidgetProps } from "@/plugin-runtime/types";
import { useClockQuery } from "../../../../entities/clock";
import { useClockStore } from "../../../../features/toggle-clock-format";
import type { ClockConfig } from "./types";
import cls from "./clock-widget.module.scss";

export function ClockWidget({ instanceId, config, host }: PluginWidgetProps) {
  const { format24h, toggleFormat } = useClockStore(instanceId);
  const { data } = useClockQuery(instanceId);
  const now = data?.nowIso ? new Date(data.nowIso) : new Date();
  const safeConfig = config as ClockConfig;

  const formatted = now.toLocaleTimeString(undefined, {
    hour12: !format24h,
  });

  return (
    <article className={cls.root}>
      <h3 className={cls.title}>{safeConfig.title}</h3>
      <p className={cls.time}>{formatted}</p>
      <button
        type="button"
        className={cls.toggle}
        onClick={() => {
          toggleFormat();
          host.emitEvent("clock.format_changed", { instanceId, format24h });
        }}
      >
        Toggle format
      </button>
    </article>
  );
}
