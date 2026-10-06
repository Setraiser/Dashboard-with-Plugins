"use client"

import { Todo } from "../../widgets/Todo";
import { isTodoPluginDependencies } from "../utils/isTodoPluginDependencies";

interface RuntimeProps {
  pluginDependencies: Record<string, unknown>;
  instanceId: string;
  config?: unknown;
  locale?: string;
}

export function TodoWidgetAdapter({
  pluginDependencies,
  instanceId,
  config,
  locale,
}: RuntimeProps) {
  if (!isTodoPluginDependencies(pluginDependencies)) {
    throw new Error("Invalid Todo plugin dependencies");
  }

  return (
    <Todo
      pluginDependencies={pluginDependencies}
      instanceId={instanceId}
      config={config}
      locale={locale}
    />
  );
}