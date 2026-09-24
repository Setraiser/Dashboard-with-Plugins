import type { InputHTMLAttributes } from "react";

export type TodoInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function TodoInput({ label, className = "", ...props }: TodoInputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      ) : null}
      <input
        {...props}
        className={[
          "h-11 w-full rounded-xl border border-todo-border bg-todo-surface px-3.5 py-2.5 text-sm text-todo-ink shadow-sm transition-all duration-200",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "focus-visible:border-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring",
          "disabled:cursor-not-allowed disabled:bg-todo-surface-alt disabled:text-slate-400",
          className,
        ].join(" ")}
      />
    </div>
  );
}
