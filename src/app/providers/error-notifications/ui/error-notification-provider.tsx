"use client";

import { ErrorToast } from "@/shared/ui/error-notification";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ErrorNotification {
  id: number;
  message: string;
}

type NotifyError = (message: string) => void;

const ErrorNotificationContext = createContext<NotifyError | null>(null);

export function ErrorNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notification, setNotification] =
    useState<ErrorNotification | null>(null);
  const notificationId = useRef(0);

  const notifyError = useCallback<NotifyError>((message) => {
    notificationId.current += 1;
    setNotification({ id: notificationId.current, message });
  }, []);

  const dismiss = useCallback(() => {
    setNotification(null);
  }, []);

  const contextValue = useMemo(() => notifyError, [notifyError]);

  return (
    <ErrorNotificationContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-end sm:inset-x-6 sm:top-6">
        {notification && (
          <ErrorToast
            key={notification.id}
            message={notification.message}
            onDismiss={dismiss}
          />
        )}
      </div>
    </ErrorNotificationContext.Provider>
  );
}

export function useErrorNotification(): NotifyError {
  const notifyError = useContext(ErrorNotificationContext);

  if (!notifyError) {
    throw new Error(
      "useErrorNotification must be used within ErrorNotificationProvider.",
    );
  }

  return notifyError;
}
