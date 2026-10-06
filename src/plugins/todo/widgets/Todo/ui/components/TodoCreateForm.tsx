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
      <div className="flex items-end gap-4 pt-1">
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
          className="shrink-0"
          disabled={!value.trim()}
        >
          {t("actions.add")}
        </TodoButton>
      </div>
    </form>
  );
}
