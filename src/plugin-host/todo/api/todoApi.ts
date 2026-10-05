import { TodoPriority } from "@/plugins/todo/entities/todo/modules/types/types";
import type {
  ICreateTodoInput,
  ITodoApi,
  ITodoItem,
  IUpdateTodoInput,
} from "@/plugins/todo";
import { apiClient } from "@/shared/lib/server/apiClient/apiClient";

type TodoApiItem = Omit<ITodoItem, "priority"> & { priority: string };

function toTodoItem(todo: TodoApiItem): ITodoItem {
  let priority: TodoPriority;

  switch (todo.priority) {
    case TodoPriority.Low:
    case "Low":
      priority = TodoPriority.Low;
      break;
    case TodoPriority.Medium:
    case "Medium":
      priority = TodoPriority.Medium;
      break;
    case TodoPriority.High:
    case "High":
      priority = TodoPriority.High;
      break;
    default:
      throw new Error("The todo API returned an unsupported priority.");
  }

  return { ...todo, priority };
}

export const todoApi: ITodoApi = {
  async getTodos(): Promise<ITodoItem[]> {
    const todos = await apiClient<TodoApiItem[]>("/api/plugins/todo", {
      method: "GET",
    });
    return todos.map(toTodoItem);
  },
  async createTodo(data: ICreateTodoInput): Promise<ITodoItem> {
    const todo = await apiClient<TodoApiItem>("/api/plugins/todo", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return toTodoItem(todo);
  },
  async deleteTodo(id: string): Promise<void> {
    return await apiClient(`/api/plugins/todo/${id}`, { method: "DELETE" });
  },
  async updateTodos(data: IUpdateTodoInput[]) {
    return await apiClient(`/api/plugins/todo`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
