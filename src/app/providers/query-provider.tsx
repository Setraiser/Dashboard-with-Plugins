"use client";

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const defaultConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
};

export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient(defaultConfig));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
