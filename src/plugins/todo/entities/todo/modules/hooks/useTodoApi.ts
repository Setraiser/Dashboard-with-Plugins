import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../const/tanstackConst";
import {
  ITodoApi,
  ITodoItem,
  ITodoQueryApi,
  IUpdateTodoInput,
} from "../types/types";

export function useTodoApi(api: ITodoApi): ITodoQueryApi {
  const queryClient = useQueryClient();

  const getTodos = useQuery({
    queryKey: todoKeys.all,
    queryFn: api.getTodos,
  });

  const createTodo = useMutation({
    mutationFn: api.createTodo,
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

    onError: (_error, _id, context) => {
      queryClient.setQueryData(todoKeys.all, context?.previousTodos);
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
