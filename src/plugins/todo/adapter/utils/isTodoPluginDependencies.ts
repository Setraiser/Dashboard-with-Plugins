import { ITodoDependencies } from "../../widgets/Todo/types/todo";

export function isTodoPluginDependencies(
  value: unknown
): value is ITodoDependencies {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("todoApi" in value)) {
    return false;
  }

  const api = value.todoApi;

  if (typeof api !== "object" || api === null) {
    return false;
  }

  return (
    "getTodos" in api &&
    typeof api.getTodos === "function" &&
    "createTodo" in api &&
    typeof api.createTodo === "function" &&
    "updateTodos" in api &&
    typeof api.updateTodos === "function" &&
    "deleteTodo" in api &&
    typeof api.deleteTodo === "function"
  );
}
