"use client";

import { useEffect, useState } from "react";
import { initDefaultRegistry } from "@/plugin-runtime/default-registry";
import { getRegisteredPluginIds, loadPlugin } from "@/plugin-runtime/registry";
import type { PluginTabItem } from "../types/types";

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Failed to load plugin navigation.";
}

async function loadPluginTabs(
  signal: AbortSignal,
): Promise<PluginTabItem[] | null> {
  initDefaultRegistry();
  const ids = getRegisteredPluginIds();
  const modules = await Promise.all(ids.map((id) => loadPlugin(id)));
  if (signal.aborted) return null;
  return modules.map((module) => ({
    id: module.manifest.id,
    displayName: module.manifest.displayName,
  }));
}

export function usePluginTabs() {
  const [tabs, setTabs] = useState<PluginTabItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    loadPluginTabs(signal)
      .then((items) => {
        if (items === null) return;
        setTabs(items);
        setError(null);
      })
      .catch((err: unknown) => {
        if (signal.aborted) return;
        setError(toErrorMessage(err));
      })
      .finally(() => {
        if (!signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { tabs, error, isLoading };
}
