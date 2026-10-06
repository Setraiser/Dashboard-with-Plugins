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
    <div className="flex items-center justify-between gap-3 border-t border-todo-border bg-todo-surface-alt px-5 py-4 sm:px-6">
      <span className="text-sm text-todo-muted">
        {hasChanges ? t("changes.unsaved") : t("changes.saved")}
      </span>
      <TodoButton
        type="button"
        variant="primary"
        onClick={onSave}
        disabled={saveDisabled}
        className="shadow-sm"
      >
        {t("actions.save")}
      </TodoButton>
    </div>
  );
}
