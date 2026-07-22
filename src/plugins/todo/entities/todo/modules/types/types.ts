export enum TodoPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export interface ITodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: TodoPriority;
};

export interface ITodoItemProps {
  todo: ITodoItem;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  setPriority: (id: string, priority: TodoPriority) => void;
}