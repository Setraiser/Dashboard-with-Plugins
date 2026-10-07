"use client";

import { useTranslations } from "next-intl";
import { TodoButton } from "@/plugins/todo/shared/ui";

interface TodoFooterProps {
  hasChanges: boolean;
  saveDisabled: boolean;
  onSave: () => void;
}

export function TodoFooter({
  hasChanges,
  saveDisabled,
  onSave,
}: TodoFooterProps) {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-stretch gap-3 border-t border-todo-border bg-todo-surface-alt px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span className="text-sm text-todo-muted">
        {hasChanges ? t("changes.unsaved") : t("changes.saved")}
      </span>
      <TodoButton
        type="button"
        variant="primary"
        onClick={onSave}
        disabled={saveDisabled}
        className="w-full shadow-sm sm:w-auto"
      >
        {t("actions.save")}
      </TodoButton>
    </div>
  );
}
