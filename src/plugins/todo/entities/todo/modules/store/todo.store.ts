import { makeAutoObservable } from "mobx";
import { ITodoItem, IUpdateTodoInput, TodoPriority } from "../types/types";

export class TodosStore {
  private dirtyChanges = new Map<
    string,
    Partial<Pick<ITodoItem, "text" | "completed" | "priority">>
  >();

  constructor() {
    makeAutoObservable(this);
  }

  get hasChanges() {
    return this.dirtyChanges.size > 0;
  }

  getChanges(id: string) {
    return this.dirtyChanges.get(id);
  }

  toggleCompleted(todo: ITodoItem) {
    const current = this.getChanges(todo.id)?.completed ?? todo.completed;

    this.setChanges(todo.id, {
      completed: !current,
    });
  }

  setPriority(id: string, priority: TodoPriority) {
    this.setChanges(id, { priority });
  }

  changeText(id: string, text: string) {
    this.setChanges(id, { text });
  }

  getUpdates(): IUpdateTodoInput[] {
    return Array.from(this.dirtyChanges, ([id, changes]) => ({
      id,
      ...changes,
    }));
  }

  clearChanges() {
    this.dirtyChanges.clear();
  }

  private setChanges(
    id: string,
    changes: Partial<Pick<ITodoItem, "text" | "completed" | "priority">>
  ) {
    const current = this.dirtyChanges.get(id) ?? {};

    this.dirtyChanges.set(id, {
      ...current,
      ...changes,
    });
  }
}
