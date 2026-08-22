export enum TodoPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface ITodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: TodoPriority;
}

export interface ITodoItemProps {
  todo: ITodoItem;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
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
