import { apiClient } from "@/shared/lib/server/apiClient/apiClient";
import { ICreateTodoInput, ITodoItem, IUpdateTodoInput } from "../types/types";

export const todoApi = {
  async getTodos(): Promise<ITodoItem[]> {
    return await apiClient("/api/plugins/todo", { method: "GET" });
  },
  async createTodo(data: ICreateTodoInput): Promise<ITodoItem> {
    return await apiClient("/api/plugins/todo", {
      method: "POST",
      body: JSON.stringify(data),
    });
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
