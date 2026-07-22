import { makeAutoObservable } from "mobx";
import { ITodoItem, TodoPriority } from "../types/types";

export class TodosStore {
  todos: ITodoItem[] = [
    {
      id: "1",
      text: "Buy groceries",
      completed: false,
      priority: TodoPriority.Low,
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(text: string) {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: TodoPriority.Low,
    };

    this.todos.push(newTodo);
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  toggleCompleted(id: string) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  setPriority(id: string, priority: TodoPriority) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, priority } : todo
    );
  }
}

export const todosStore = new TodosStore();
