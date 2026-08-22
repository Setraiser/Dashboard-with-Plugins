import { makeAutoObservable } from "mobx";
import { todoApi } from "../api/todoApi";
import { ITodoItem, IUpdateTodoInput, TodoPriority } from "../types/types";

export class TodosStore {
  todos = new Map<string, ITodoItem>();
  serverTodos = new Map<string, ITodoItem>();
  dirtyTodoIds = new Set<string>();
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get todoList() {
    return [...this.todos.values()];
  }

  async addTodo(text: string) {
    const newTodo = await todoApi.createTodo({
      text,
      priority: TodoPriority.Low,
    });
    this.todos.set(newTodo.id, newTodo);
    this.serverTodos.set(newTodo.id, newTodo);
  }

  toggleCompleted(id: string) {
    this.updateTodo(id, { completed: !this.todos.get(id)?.completed });
  }

  setPriority(id: string, priority: TodoPriority) {
    console.log(id, priority, "PR");
    this.updateTodo(id, { priority });
  }

  changeText(id: string, text: string) {
    this.updateTodo(id, { text });
  }

  async getTodos() {
    const todos = await todoApi.getTodos();
    this.todos = new Map(todos.map((todo) => [todo.id, todo]));
    this.serverTodos = new Map(todos.map((todo) => [todo.id, todo]));
  }

  private updateTodo(
    id: string,
    changes: Partial<Pick<ITodoItem, "text" | "completed" | "priority">>
  ) {
    const todo = this.todos.get(id);
    console.log(todo, changes, "CH");

    if (!todo) {
      return;
    }

    Object.assign(todo, changes);

    this.updateDirtyState(id);
  }

  get hasChanges() {
    return this.dirtyTodoIds.size > 0;
  }

  private getTodoChanges(
    current: ITodoItem,
    original: ITodoItem
  ): Partial<ITodoItem> {
    const changes: Partial<ITodoItem> = {};

    if (current.text !== original.text) {
      changes.text = current.text;
    }

    if (current.completed !== original.completed) {
      changes.completed = current.completed;
    }

    if (current.priority !== original.priority) {
      changes.priority = current.priority;
    }

    return changes;
  }

  private updateDirtyState(id: string) {
    const current = this.todos.get(id);
    const original = this.serverTodos.get(id);

    if (!current || !original) {
      return;
    }

    const changes = this.getTodoChanges(current, original);
    console.log(changes, "CHANGES");

    if (Object.keys(changes).length > 0) {
      this.dirtyTodoIds.add(id);
    } else {
      this.dirtyTodoIds.delete(id);
    }
  }

  private getTodoUpdates(): IUpdateTodoInput[] {
    const updates: IUpdateTodoInput[] = [...this.dirtyTodoIds]
      .map((id) => {
        const current = this.todos.get(id);
        const original = this.serverTodos.get(id);

        if (!current || !original) {
          return null;
        }

        const changes = this.getTodoChanges(current, original);

        return {
          id,
          ...changes,
        };
      })
      .filter(
        (todo): todo is { id: string } & Partial<ITodoItem> => todo !== null
      );
    return updates;
  }

  async deleteTodo(id: string) {
    const todo = this.todos.get(id);

    if (!todo) {
      return;
    }

    // optimistic update
    this.todos.delete(id);

    try {
      await todoApi.deleteTodo(id);

      this.serverTodos.delete(id);

      this.dirtyTodoIds.delete(id);
    } catch {
      // rollback
      this.todos.set(id, todo);

      this.error = "Не удалось удалить Todo";
    }
  }

  async save() {
    if (!this.hasChanges) {
      return;
    }

    const updates: IUpdateTodoInput[] = this.getTodoUpdates();

    if (updates.length === 0) {
      return;
    }

    try {
      await todoApi.updateTodos(updates);

      // После успешного сохранения текущие данные
      // становятся новым server snapshot
      for (const update of updates) {
        const current = this.todos.get(update.id);

        if (current) {
          this.serverTodos.set(update.id, { ...current });
        }
      }

      this.dirtyTodoIds.clear();
    } catch {
      this.error = "Не удалось сохранить изменения";
    }
  }
}

export const todosStore = new TodosStore();
