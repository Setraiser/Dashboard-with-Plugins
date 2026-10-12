"use client";

import { FallingClicker } from "../../widgets/FallingClicker";
import { isFallingClickerDependencies } from "../utils/isFallingClickerDependencies";

interface FallingClickerWidgetProps {
  /** Зависимости в формате общего plugin runtime. */
  pluginDependencies: Record<string, unknown>;
  /** Локаль, выбранная хост-приложением. */
  locale?: string;
}

/** Адаптирует контракт runtime к API и props игрового виджета. */
export function FallingClickerWidgetAdapter({
  pluginDependencies,
  locale,
}: FallingClickerWidgetProps) {
  if (!isFallingClickerDependencies(pluginDependencies)) {
    throw new Error("Invalid Falling Clicker plugin dependencies.");
  }

  return (
    <FallingClicker
      api={pluginDependencies.fallingClickerApi}
      locale={locale}
    />
  );
}
