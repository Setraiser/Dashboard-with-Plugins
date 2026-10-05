"use client";

import { TodoItem, TodosStore } from '@/plugins/todo/entities/todo';
import { TodoButton, TodoInput } from '@/plugins/todo/shared/ui';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import {
  ITodoItem,
  TodoPriority,
  useDebounce,
  useTodoApi,
  useTodoFilters,
  useTodoHandlers,
} from "../../../entities/todo";
import { priorityLabels } from "../../../entities/todo/modules/types/types";
import { TodoPriorityFilter, TodoStatusFilter } from "../../../entities/todo/modules/hooks/useTodoFilters";
import { ITodoProps } from "../types/todo";
import { TodoErrorToast } from "./TodoErrorToast";

const Todos: React.FC<ITodoProps> = ({ pluginDependencies }) => {
  const { todoApi, reportOperationError } = pluginDependencies;
  const [value, setValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<TodoPriorityFilter>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleOperationError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (reportOperationError) {
        reportOperationError(error, fallbackMessage);
        return;
      }

      setLocalError(fallbackMessage);
    },
    [reportOperationError],
  );

  const todoQueries = useTodoApi(todoApi, handleOperationError);
  const todosStore = useMemo(() => new TodosStore(), []);
  const { handleCreateTodo, handleDeleteTodo, handleSave } = useTodoHandlers(todosStore, todoQueries);

  const { data: todos = [] } = todoQueries.getTodos;

  const visibleTodos = todos.map((todo) => {
    const changes = todosStore.getChanges(todo.id);

    return changes ? { ...todo, ...changes } : todo;
  });
  const filteredTodos = useTodoFilters({
    todos: visibleTodos,
    statusFilter,
    priorityFilter,
    searchQuery: debouncedSearchQuery,
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
      {localError && (
        <TodoErrorToast message={localError} onDismiss={() => setLocalError(null)} />
      )}
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

          <div className="space-y-3 rounded-2xl border border-todo-border bg-todo-surface-alt p-3">
            <div className="min-w-0">
              <label htmlFor="todo-search" className="sr-only">
                Search tasks
              </label>
              <input
                id="todo-search"
                type="search"
                value={searchQuery}
                aria-label="Search tasks by name"
                placeholder="Search tasks..."
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-todo-border bg-todo-surface px-3 py-2 text-sm text-todo-ink placeholder:text-todo-muted focus-visible:border-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-todo-muted">
                  Status
                </span>
                <div
                  role="group"
                  aria-label="Filter tasks by status"
                  className="inline-flex w-fit max-w-full rounded-xl border border-todo-border bg-todo-surface p-1"
                >
                  {(
                    [
                      ["all", "All"],
                      ["active", "Active"],
                      ["completed", "Completed"],
                    ] as const
                  ).map(([filter, label]) => {
                    const isSelected = statusFilter === filter;

                    return (
                      <button
                        key={filter}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setStatusFilter(filter)}
                        className={[
                          "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-ring",
                          isSelected
                            ? "bg-todo-primary text-white shadow-sm"
                            : "text-todo-muted hover:text-todo-ink",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-todo-muted">
                  Priority
                </span>
                <div
                  role="group"
                  aria-label="Filter tasks by priority"
                  className="inline-flex w-fit max-w-full rounded-xl border border-todo-border bg-todo-surface p-1"
                >
                  {(
                    [
                      [null, "All"],
                      [TodoPriority.Low, priorityLabels[TodoPriority.Low]],
                      [TodoPriority.Medium, priorityLabels[TodoPriority.Medium]],
                      [TodoPriority.High, priorityLabels[TodoPriority.High]],
                    ] as const
                  ).map(([filter, label]) => {
                    const isSelected = priorityFilter === filter;

                    return (
                      <button
                        key={filter ?? "all"}
                        type="button"
                        aria-label={
                          filter === null ? "All priorities" : label
                        }
                        aria-pressed={isSelected}
                        onClick={() => setPriorityFilter(filter)}
                        className={[
                          "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-ring",
                          isSelected
                            ? "bg-todo-primary text-white shadow-sm"
                            : "text-todo-muted hover:text-todo-ink",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-todo-border bg-todo-surface-alt px-4 py-10 text-center">
                {visibleTodos.length === 0 ? (
                  <>
                    <p className="text-base font-medium text-slate-700">No tasks yet.</p>
                    <p className="mt-1 text-sm text-slate-500">Add your first task to get started.</p>
                  </>
                ) : (
                  <p className="text-base font-medium text-slate-700">
                    No tasks match the selected filters.
                  </p>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredTodos.map((todo) => (
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