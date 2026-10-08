import { useTranslations } from "next-intl";
import { TodoItem } from "@/plugins/todo/entities/todo";
import type { ITodoItem } from "@/plugins/todo/entities/todo/modules/types/types";

interface TodoListProps {
  todos: ITodoItem[];
  hasUnfilteredTodos: boolean;
  onDelete: (id: string) => void;
  onToggleCompleted: (todo: ITodoItem) => void;
  onPriorityChange: (id: string, priority: ITodoItem["priority"]) => void;
  onTextChange: (id: string, text: string) => void;
}

export function TodoList({
  todos,
  hasUnfilteredTodos,
  onDelete,
  onToggleCompleted,
  onPriorityChange,
  onTextChange,
}: TodoListProps) {
  const t = useTranslations("common");

  return (
    <div className="space-y-3">
      {todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-todo-border bg-todo-surface-alt px-4 py-10 text-center">
          {hasUnfilteredTodos ? (
            <p className="text-base font-medium text-slate-700">
              {t("empty.filtered")}
            </p>
          ) : (
            <>
              <p className="text-base font-medium text-slate-700">
                {t("empty.title")}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {t("empty.description")}
              </p>
            </>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              changeText={onTextChange}
              deleteTodo={onDelete}
              toggleCompleted={onToggleCompleted}
              setPriority={onPriorityChange}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
