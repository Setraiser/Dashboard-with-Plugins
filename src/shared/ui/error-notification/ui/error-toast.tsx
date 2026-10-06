"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  const t = useTranslations("common");
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-white p-4 text-slate-900 shadow-lg dark:border-red-900 dark:bg-slate-900 dark:text-slate-100"
    >
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 dark:bg-red-950 dark:text-red-300"
      >
        !
      </span>
      <p className="min-w-0 flex-1 text-sm leading-5">{message}</p>
      <button
        type="button"
        aria-label={t("closeNotification")}
        onClick={onDismiss}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-lg leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
