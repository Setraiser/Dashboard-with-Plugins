"use client";

import {
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { getQueryClient } from "../model/tanstack/queryClient";

export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => getQueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
