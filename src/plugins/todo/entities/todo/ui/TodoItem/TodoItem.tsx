
"use client";

import { observer } from 'mobx-react-lite';
import React from 'react';
import { ITodoItemProps, priorityLabels, TodoPriority } from '../../modules/types/types';

const priorityDotClassNames: Record<TodoPriority, string> = {
  [TodoPriority.Low]: "bg-slate-500 ring-slate-200 dark:bg-slate-400 dark:ring-slate-700",
  [TodoPriority.Medium]: "bg-amber-500 ring-amber-200 dark:bg-amber-400 dark:ring-amber-800",
  [TodoPriority.High]: "bg-rose-500 ring-rose-200 dark:bg-rose-400 dark:ring-rose-800",
};

function TodoPriorityBadge({ priority }: { priority: TodoPriority }) {
  return (
    <span className="inline-flex items-center justify-center" aria-label={priorityLabels[priority]}>
      <span
        aria-hidden="true"
        className={[
          "inline-block h-2.5 w-2.5 rounded-full ring-4 ring-inset",
          priorityDotClassNames[priority],
        ].join(" ")}
      />
      <span className="sr-only">{priorityLabels[priority]}</span>
    </span>
  );
}

const TodoItem: React.FC<ITodoItemProps> = observer((props) => {
  const { deleteTodo, setPriority, todo, toggleCompleted, changeText } = props;

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
            aria-label={`Mark ${todo.text} as complete`}
            onChange={() => toggleCompleted(todo)}
            className="h-4 w-4 rounded border border-todo-border text-todo-primary accent-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
          />
        </label>

        <input
          type="text"
          value={todo.text}
          aria-label={`Task name for ${todo.text}`}
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
          <span className="sr-only">Priority</span>
          <TodoPriorityBadge priority={todo.priority} />
          <select
            value={todo.priority}
            aria-label="Task priority"
            onChange={(event) => setPriority(todo.id, event.target.value as TodoPriority)}
            className="appearance-none bg-transparent pr-1 text-sm font-medium text-todo-ink outline-none"
          >
            <option value={TodoPriority.Low}>{priorityLabels[TodoPriority.Low]}</option>
            <option value={TodoPriority.Medium}>{priorityLabels[TodoPriority.Medium]}</option>
            <option value={TodoPriority.High}>{priorityLabels[TodoPriority.High]}</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="inline-flex items-center justify-center rounded-xl border border-todo-border bg-todo-surface-alt px-3 py-2 text-sm font-medium text-todo-muted transition-colors duration-200 hover:border-todo-border-strong hover:bg-todo-surface hover:text-todo-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
        >
          Delete
        </button>
      </div>
    </li>
  );
});

export default TodoItem;

