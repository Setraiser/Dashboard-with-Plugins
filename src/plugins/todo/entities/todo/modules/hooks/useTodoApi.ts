import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { todoKeys } from "../const/tanstackConst";
import {
  ITodoApi,
  ITodoItem,
  ITodoQueryApi,
  IUpdateTodoInput,
} from "../types/types";

export function useTodoApi(
  api: ITodoApi,
  reportOperationError: (error: unknown, fallbackMessage: string) => void,
): ITodoQueryApi {
  const queryClient = useQueryClient();

  const getTodos = useQuery({
    queryKey: todoKeys.all,
    queryFn: api.getTodos,
  });

  useEffect(() => {
    if (getTodos.error) {
      reportOperationError(
        getTodos.error,
        "Не удалось загрузить задачи. Попробуйте ещё раз.",
      );
    }
  }, [getTodos.error, reportOperationError]);

  const createTodo = useMutation({
    mutationFn: api.createTodo,
    onError: (error) =>
      reportOperationError(error, "Не удалось добавить задачу. Попробуйте ещё раз."),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.all,
      });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: api.deleteTodo,

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: todoKeys.all,
      });

      const previousTodos = queryClient.getQueryData<ITodoItem[]>(todoKeys.all);

      queryClient.setQueryData<ITodoItem[]>(todoKeys.all, (old = []) =>
        old.filter((todo) => todo.id !== id)
      );

      return { previousTodos };
    },

    onError: (error, _id, context) => {
      queryClient.setQueryData(todoKeys.all, context?.previousTodos);
      reportOperationError(error, "Не удалось удалить задачу. Попробуйте ещё раз.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.all,
      });
    },
  });

  const updateTodos = useMutation<void, Error, IUpdateTodoInput[]>({
    mutationFn: async (todosToUpdate) => {
      await api.updateTodos(todosToUpdate);
    },
    onError: (error) =>
      reportOperationError(error, "Не удалось сохранить изменения. Попробуйте ещё раз."),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.all,
      });
    },
  });

  return {
    getTodos,
    createTodo,
    deleteTodo,
    updateTodos,
  };
}
