
"use client";

import { observer } from 'mobx-react-lite';
import { useTranslations } from "next-intl";
import React from 'react';
import { ITodoItemProps, TodoPriority } from '../../modules/types/types';
import { TodoPriorityBadge } from "../TodoPriorityBadge/TodoPriorityBadge";

const TodoItem: React.FC<ITodoItemProps> = observer((props) => {
  const { deleteTodo, setPriority, todo, toggleCompleted, changeText } = props;
  const t = useTranslations("common");

  return (
    <li
      className={[
        "flex flex-col gap-4 rounded-2xl border p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        todo.completed ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-700/50 dark:bg-emerald-900/20" : "border-todo-border bg-todo-surface",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 p-0.5">
        <label className="inline-flex items-center self-center rounded-lg p-1.5">
          <input
            type="checkbox"
            checked={todo.completed}
            aria-label={t(
              todo.completed ? "fields.markIncomplete" : "fields.markComplete",
              { task: todo.text },
            )}
            onChange={() => toggleCompleted(todo)}
            className="h-4 w-4 rounded border border-todo-border text-todo-primary accent-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
          />
        </label>

        <input
          type="text"
          value={todo.text}
          aria-label={t("fields.taskName", { task: todo.text })}
          onChange={(event) => changeText(todo.id, event.target.value)}
          className={[
            "w-full min-w-0 rounded-xl border bg-transparent px-2.5 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:border-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring",
            todo.completed ? "border-transparent text-slate-400 line-through dark:text-slate-500" : "border-transparent text-todo-ink hover:border-todo-border",
          ].join(" ")}
        />
      </div>

      <div className="flex items-center gap-2 pt-0.5 sm:justify-end sm:pt-0">
        <label className="flex items-center gap-2.5 rounded-xl border border-todo-border bg-todo-surface-alt px-2.5 py-2 text-xs text-todo-muted shadow-sm">
          <span className="sr-only">{t("filters.priority")}</span>
          <TodoPriorityBadge
            priority={todo.priority}
            label={t(`priority.${todo.priority}`)}
          />
          <select
            value={todo.priority}
            aria-label={t("fields.priority")}
            onChange={(event) => setPriority(todo.id, event.target.value as TodoPriority)}
            className="appearance-none bg-transparent pr-1 text-sm font-medium text-todo-ink outline-none"
          >
            <option value={TodoPriority.Low}>{t("priority.low")}</option>
            <option value={TodoPriority.Medium}>{t("priority.medium")}</option>
            <option value={TodoPriority.High}>{t("priority.high")}</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="inline-flex items-center justify-center rounded-xl border border-todo-border bg-todo-surface-alt px-3 py-2 text-sm font-medium text-todo-muted transition-colors duration-200 hover:border-todo-border-strong hover:bg-todo-surface hover:text-todo-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
        >
          {t("actions.delete")}
        </button>
      </div>
    </li>
  );
});

export default TodoItem;
