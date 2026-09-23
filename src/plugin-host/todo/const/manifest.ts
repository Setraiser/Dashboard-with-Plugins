import { PluginModule } from "@/plugin-runtime/model/types/plugin-runtime-types";
import Todo from "@/plugins/todo/widgets/Todo/ui/Todo";
import { PluginId } from "@/shared";

const todoPlugin: PluginModule = {
  manifest: {
    id: PluginId.Todo,
    version: "1.0.0",
    displayName: "Todo",
  },
  Widget: Todo as unknown as PluginModule["Widget"],
};

export default todoPlugin;
