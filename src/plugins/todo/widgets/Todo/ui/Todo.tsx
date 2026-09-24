"use client";

import { TodoItem, TodosStore } from '@/plugins/todo/entities/todo';
import { TodoButton, TodoInput } from '@/plugins/todo/shared/ui';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { ITodoItem, TodoPriority, useTodoApi, useTodoHandlers } from "../../../entities/todo";
import { ITodoProps } from "../types/todo";

const Todos: React.FC<ITodoProps> = ({ pluginDependencies }) => {
  const { todoApi } = pluginDependencies;
  const [value, setValue] = useState<string>("");

  const todoQueries = useTodoApi(todoApi);
  const todosStore = useMemo(() => new TodosStore(), []);
  const { handleCreateTodo, handleDeleteTodo, handleSave } = useTodoHandlers(todosStore, todoQueries);

  const { data: todos = [] } = todoQueries.getTodos;

  const visibleTodos = todos.map((todo) => {
    const changes = todosStore.getChanges(todo.id);

    return changes ? { ...todo, ...changes } : todo;
  });

  const addTodo = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    await handleCreateTodo({ text: trimmedText, priority: TodoPriority.Low });
    setValue("");
  };

  const deleteTodo = async (id: string) => {
    await handleDeleteTodo(id);
  };

  const toggleCompleted = (todoItem: ITodoItem) => {
    todosStore.toggleCompleted(todoItem);
  };

  const setPriority = (id: string, priority: TodoPriority) => {
    todosStore.setPriority(id, priority);
  };

  const changeText = (id: string, text: string) => {
    todosStore.changeText(id, text);
  };

  const saveTodos = async () => {
    await handleSave();
  };

  const isSaveDisabled = !todosStore.hasChanges || todoQueries.updateTodos.isPending;

  return (
    <div className="todo-plugin-root mx-auto w-full max-w-3xl p-3 sm:p-5">
      <section className="overflow-hidden rounded-2xl border border-todo-border bg-todo-surface text-todo-ink shadow-[0_14px_44px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)]">
        <div
          className="border-b border-todo-border bg-todo-surface-alt"
          style={{ padding: "20px 20px 18px" }}
        >
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-todo-muted leading-[1.4]">Tasks</p>
              <h2 className="mt-3 text-xl font-semibold text-todo-ink leading-[1.2] sm:text-2xl">Todo</h2>
            </div>
            <span className="inline-flex items-center rounded-full border border-todo-border bg-todo-surface px-3 py-1.5 text-[11px] font-semibold leading-none text-todo-muted ring-1 ring-inset ring-todo-border/70">
              {visibleTodos.length} items
            </span>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:px-6 sm:py-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void addTodo(value);
            }}
            className="space-y-5"
          >
            <div className="flex items-end gap-4 pt-1">
              <div className="min-w-0 flex-1">
                <label htmlFor="todo-input" className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-todo-muted leading-[1.4]">
                  Add task
                </label>
                <TodoInput
                  id="todo-input"
                  type="text"
                  value={value}
                  placeholder="Add a new todo..."
                  aria-label="New todo"
                  className="min-w-0"
                  onChange={(event) => setValue(event.target.value)}
                />
              </div>

              <TodoButton type="submit" variant="primary" size="md" className="shrink-0" disabled={!value.trim()}>
                Add task
              </TodoButton>
            </div>
          </form>

          <div className="space-y-3">
            {visibleTodos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-todo-border bg-todo-surface-alt px-4 py-10 text-center">
                <p className="text-base font-medium text-slate-700">No tasks yet.</p>
                <p className="mt-1 text-sm text-slate-500">Add your first task to get started.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {visibleTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    changeText={changeText}
                    deleteTodo={deleteTodo}
                    toggleCompleted={toggleCompleted}
                    setPriority={setPriority}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-todo-border bg-todo-surface-alt px-5 py-4 sm:px-6">
          <span className="text-sm text-todo-muted">
            {todosStore.hasChanges ? "Unsaved changes" : "All changes saved"}
          </span>
          <TodoButton
            type="button"
            variant="primary"
            onClick={() => void saveTodos()}
            disabled={isSaveDisabled}
            className="shadow-sm"
          >
            Save changes
          </TodoButton>
        </div>
      </section>
    </div>
  );
};

export default observer(Todos);