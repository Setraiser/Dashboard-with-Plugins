import { useTranslations } from "next-intl";

interface TodoHeaderProps {
  taskCount: number;
}

export function TodoHeader({ taskCount }: TodoHeaderProps) {
  const t = useTranslations("common");

  return (
    <div className="border-b border-todo-border bg-todo-surface-alt px-4 py-4 sm:px-5 sm:py-[18px]">
      <div className="flex items-center justify-between gap-3 sm:gap-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-todo-muted leading-[1.4]">
            {t("tasks.eyebrow")}
          </p>
          <h2 className="mt-3 text-xl font-semibold text-todo-ink leading-[1.2] sm:text-2xl">
            {t("tasks.title")}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-todo-border bg-todo-surface px-2.5 py-1.5 text-[11px] font-semibold leading-none text-todo-muted ring-1 ring-inset ring-todo-border/70 sm:px-3">
          {t("tasks.count", { count: taskCount })}
        </span>
      </div>
    </div>
  );
}
