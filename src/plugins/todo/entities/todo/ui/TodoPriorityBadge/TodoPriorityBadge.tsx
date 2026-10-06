import { TodoPriority } from '../../modules/types/types';

const priorityDotClassNames: Record<TodoPriority, string> = {
  [TodoPriority.Low]: "bg-slate-500 ring-slate-200 dark:bg-slate-400 dark:ring-slate-700",
  [TodoPriority.Medium]: "bg-amber-500 ring-amber-200 dark:bg-amber-400 dark:ring-amber-800",
  [TodoPriority.High]: "bg-rose-500 ring-rose-200 dark:bg-rose-400 dark:ring-rose-800",
};

export function TodoPriorityBadge({
  priority,
  label,
}: {
  priority: TodoPriority;
  label: string;
}) {
  return (
    <span className="inline-flex items-center justify-center" aria-label={label}>
      <span
        aria-hidden="true"
        className={[
          "inline-block h-2.5 w-2.5 rounded-full ring-4 ring-inset",
          priorityDotClassNames[priority],
        ].join(" ")}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}