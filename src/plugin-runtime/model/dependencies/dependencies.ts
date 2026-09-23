import { todoApi } from "@/plugin-host/todo/api/todoApi";
import { PluginId } from "@/shared";

export const pluginDependencies = {
  [PluginId.Todo]: { todoApi },
  [PluginId.Clock]: {},
};
