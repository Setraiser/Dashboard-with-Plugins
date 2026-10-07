"use client";

import { useTranslations } from "next-intl";
import { TodoButton, TodoInput } from "@/plugins/todo/shared/ui";

interface TodoCreateFormProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (text: string) => void;
}

export function TodoCreateForm({
  value,
  onValueChange,
  onSubmit,
}: TodoCreateFormProps) {
  const t = useTranslations("common");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-5"
    >
      <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-end sm:gap-4">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="todo-input"
            className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-todo-muted leading-[1.4]"
          >
            {t("fields.newTask")}
          </label>
          <TodoInput
            id="todo-input"
            type="text"
            value={value}
            placeholder={t("placeholders.newTask")}
            aria-label={t("fields.newTask")}
            required
            maxLength={500}
            className="min-w-0"
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>

        <TodoButton
          type="submit"
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
          disabled={!value.trim()}
        >
          {t("actions.add")}
        </TodoButton>
      </div>
    </form>
  );
}
