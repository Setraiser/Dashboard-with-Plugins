import { useTranslations } from "next-intl";
import { TodoPriority, TodoStatus } from "@/plugins/todo/entities/todo/modules/types/types";
import type {
  TodoPriorityFilter,
  TodoStatusFilter,
} from "@/plugins/todo/entities/todo/modules/hooks/useTodoFilters";

interface TodoFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: TodoStatusFilter;
  onStatusFilterChange: (filter: TodoStatusFilter) => void;
  priorityFilter: TodoPriorityFilter;
  onPriorityFilterChange: (filter: TodoPriorityFilter) => void;
}

const filterButtonClassName = (isSelected: boolean) =>
  [
    "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-ring",
    isSelected
      ? "bg-todo-primary text-white shadow-sm"
      : "text-todo-muted hover:text-todo-ink",
  ].join(" ");

export function TodoFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: TodoFiltersProps) {
  const t = useTranslations("common");
  const priorityFilters: [TodoPriorityFilter, string][] = [
    [null, t("filters.all")],
    [TodoPriority.Low, t("priority.low")],
    [TodoPriority.Medium, t("priority.medium")],
    [TodoPriority.High, t("priority.high")],
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-todo-border bg-todo-surface-alt p-3">
      <div className="min-w-0">
        <label htmlFor="todo-search" className="sr-only">
          {t("fields.search")}
        </label>
        <input
          id="todo-search"
          type="search"
          value={searchQuery}
          aria-label={t("fields.searchAccessible")}
          placeholder={t("placeholders.search")}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="w-full rounded-xl border border-todo-border bg-todo-surface px-3 py-2 text-sm text-todo-ink placeholder:text-todo-muted focus-visible:border-todo-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-todo-muted">
            {t("filters.status")}
          </span>
          <div
            role="group"
            aria-label={t("filters.statusGroup")}
            className="inline-flex w-fit max-w-full flex-wrap rounded-xl border border-todo-border bg-todo-surface p-1"
          >
            {[
              [TodoStatus.All, t("filters.all")],
              [TodoStatus.Active, t("filters.active")],
              [TodoStatus.Completed, t("filters.completed")],
            ].map(([filter, label]) => (
              <button
                key={filter}
                type="button"
                aria-pressed={statusFilter === filter}
                onClick={() => onStatusFilterChange(filter as TodoStatusFilter)}
                className={filterButtonClassName(statusFilter === filter)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-todo-muted">
            {t("filters.priority")}
          </span>
          <div
            role="group"
            aria-label={t("filters.priorityGroup")}
            className="inline-flex w-fit max-w-full flex-wrap rounded-xl border border-todo-border bg-todo-surface p-1"
          >
            {priorityFilters.map(([selectedFilter, label]) => {
              const isSelected = priorityFilter === selectedFilter;

              return (
                <button
                  key={selectedFilter ?? "all"}
                  type="button"
                  aria-label={
                    selectedFilter === null
                      ? t("filters.allPriorities")
                      : label
                  }
                  aria-pressed={isSelected}
                  onClick={() => onPriorityFilterChange(selectedFilter)}
                  className={filterButtonClassName(isSelected)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
