import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export enum TodoPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export const priorityLabels = {
  [TodoPriority.Low]: "Низкий",
  [TodoPriority.Medium]: "Средний",
  [TodoPriority.High]: "Высокий",
};

export interface ITodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: TodoPriority;
}

export interface ITodoItemProps {
  todo: ITodoItem;
  deleteTodo: (id: string) => void;
  toggleCompleted: (todoItem: ITodoItem) => void;
  setPriority: (id: string, priority: TodoPriority) => void;
  changeText: (id: string, text: string) => void;
}

export interface IUpdateTodoInput {
  id: string;
  text?: string;
  priority?: TodoPriority;
  completed?: boolean;
}

export interface ICreateTodoInput {
  text: string;
  priority: TodoPriority;
}

export interface ITodoApi {
  getTodos(): Promise<ITodoItem[]>;
  createTodo(data: ICreateTodoInput): Promise<ITodoItem>;
  deleteTodo(id: string): Promise<void>;
  updateTodos(data: IUpdateTodoInput[]): Promise<unknown>;
}

export interface ITodoQueryApi {
  getTodos: UseQueryResult<ITodoItem[], Error>;

  createTodo: UseMutationResult<ITodoItem, Error, ICreateTodoInput>;

  deleteTodo: UseMutationResult<void, Error, string>;

  updateTodos: UseMutationResult<void, Error, IUpdateTodoInput[]>;
}
