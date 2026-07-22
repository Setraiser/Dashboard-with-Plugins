import { PluginModule } from "@/plugin-runtime/types";
import { todoConfigSchema } from "@/plugins/todo/entities/todo/modules/config/todoConfigSchema";
import Todo from "@/plugins/todo/widgets/Todo/ui/Todo";

const todoPlugin: PluginModule = {
  manifest: {
    id: "todo",
    version: "1.0.0",
    apiVersion: "1.0.0",
    displayName: "Todo",
    slots: ["dashboard.main", "dashboard.sidebar"],
    permissions: ["dashboard:read"],
    configSchema: todoConfigSchema,
  },
  Widget: Todo as PluginModule["Widget"],
};

export default todoPlugin;
