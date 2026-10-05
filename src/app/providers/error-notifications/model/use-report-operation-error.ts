"use client";

import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useErrorNotification } from "../ui/error-notification-provider";

export function useReportOperationError() {
  const router = useRouter();
  const notifyError = useErrorNotification();

  return useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (error instanceof ApiClientError && error.status === 401) {
        router.replace("/login");
        return;
      }

      notifyError(fallbackMessage);
    },
    [notifyError, router],
  );
}
