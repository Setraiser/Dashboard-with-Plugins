"use client";

import { TodosStore } from '@/plugins/todo/entities/todo';
import { observer } from 'mobx-react-lite';
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from 'react';
import {
  ITodoItem,
  TodoPriority,
  TodoPriorityFilter,
  TodoStatusFilter,
  useDebounce,
  useTodoApi,
  useTodoFilters,
  useTodoHandlers
} from "../../../entities/todo";

import { TodoI18nProvider } from "../../../i18n/todo-i18n-provider";
import { getTodoErrorKey } from "../modules/functions/getTodoErrorKey";
import { ITodoProps } from "../modules/types/todo";
import { TodoErrorToast } from "./TodoErrorToast";
import { TodoCreateForm } from "./components/TodoCreateForm";
import { TodoFilters } from "./components/TodoFilters";
import { TodoFooter } from "./components/TodoFooter";
import { TodoHeader } from "./components/TodoHeader";
import { TodoList } from "./components/TodoList";

const Todos: React.FC<Omit<ITodoProps, "locale">> = ({
  pluginDependencies,
}) => {
  const { todoApi, reportOperationError } = pluginDependencies;
  const t = useTranslations("common");
  const [value, setValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<TodoPriorityFilter>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleOperationError = useCallback(
    (error: unknown, fallbackKey: string) => {
      const message = t(getTodoErrorKey(error, fallbackKey));
      if (reportOperationError) {
        reportOperationError(error, message);
        return;
      }

      setLocalError(message);
    },
    [reportOperationError, t],
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
      setLocalError(t("errors.validation"));
      return;
    }
    if (trimmedText.length > 500) {
      setLocalError(t("errors.validation"));
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
        <TodoErrorToast
          message={localError}
          closeLabel={t("errors.close")}
          onDismiss={() => setLocalError(null)}
        />
      )}
      <section className="overflow-hidden rounded-2xl border border-todo-border bg-todo-surface text-todo-ink shadow-[0_14px_44px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)]">
        <TodoHeader taskCount={visibleTodos.length} />

        <div className="space-y-6 p-4 sm:p-6">
          <TodoCreateForm
            value={value}
            onValueChange={setValue}
            onSubmit={(text) => void addTodo(text)}
          />
          <TodoFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
          />
          <TodoList
            todos={filteredTodos}
            hasUnfilteredTodos={visibleTodos.length > 0}
            onDelete={deleteTodo}
            onToggleCompleted={toggleCompleted}
            onPriorityChange={setPriority}
            onTextChange={changeText}
          />
        </div>

        <TodoFooter
          hasChanges={todosStore.hasChanges}
          saveDisabled={isSaveDisabled}
          onSave={() => void saveTodos()}
        />
      </section>
    </div>
  );
};

const ObservedTodos = observer(Todos);

const Todo: React.FC<ITodoProps> = ({ locale, ...props }) => (
  <TodoI18nProvider locale={locale}>
    <ObservedTodos {...props} />
  </TodoI18nProvider>
);

export default Todo;