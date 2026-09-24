import { TodoWidgetAdapter } from "./adapter";

export { TodoPriority } from "./entities/todo/modules/types/types";
export type {
  ICreateTodoInput,
  ITodoApi,
  ITodoItem,
  IUpdateTodoInput,
} from "./entities/todo/modules/types/types";

const todoPlugin = {
  manifest: {
    id: "todo",
    version: "1.0.0",
    displayName: "Todo",
  },
  Widget: TodoWidgetAdapter,
  dispose: () => {},
};

export default todoPlugin;
