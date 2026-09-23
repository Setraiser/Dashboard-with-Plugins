import { TodosStore } from "../store/todo.store";
import { ICreateTodoInput, ITodoQueryApi } from "../types/types";
export function useTodoHandlers(store: TodosStore, api: ITodoQueryApi) {
  const handleCreateTodo = async (data: ICreateTodoInput) => {
    const result = await api.createTodo.mutateAsync(data);

    store.clearChanges();

    return result;
  };

  const handleSave = async () => {
    const updates = store.getUpdates();

    if (!updates.length) {
      return;
    }

    await api.updateTodos.mutateAsync(updates);

    store.clearChanges();
  };

  const handleDeleteTodo = async (id: string) => {
    return await api.deleteTodo.mutateAsync(id);
  };

  return {
    handleCreateTodo,
    handleSave,
    handleDeleteTodo,
  };
}
