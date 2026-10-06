"use client";

import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useErrorNotification } from "../ui/error-notification-provider";

export function useReportOperationError() {
  const router = useRouter();
  const notifyError = useErrorNotification();
  const t = useTranslations("errors");

  return useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (error instanceof ApiClientError) {
        if (error.code === "SESSION_EXPIRED" || error.status === 401) {
          router.replace("/login");
          return;
        }

        if (error.code === "FORBIDDEN") {
          notifyError(t("forbidden"));
          return;
        }
        if (error.code === "VALIDATION_ERROR") {
          notifyError(t("validation"));
          return;
        }
        if (error.code === "INTERNAL_ERROR") {
          notifyError(t("unexpected"));
          return;
        }
      }

      notifyError(fallbackMessage);
    },
    [notifyError, router, t],
  );
}
