import {
  ICreateTodoInput,
  ITodoItem,
  IUpdateTodoInput,
} from "../../../entities/todo/modules/types/types";

interface ITodoApi {
  getTodos(): Promise<ITodoItem[]>;
  createTodo(data: ICreateTodoInput): Promise<ITodoItem>;
  deleteTodo(id: string): Promise<void>;
  updateTodos(data: IUpdateTodoInput[]): Promise<unknown>;
}

export interface ITodoDependencies {
  todoApi: ITodoApi;
}

export interface ITodoProps {
  instanceId?: string;
  config?: unknown;
  pluginDependencies: ITodoDependencies;
}
