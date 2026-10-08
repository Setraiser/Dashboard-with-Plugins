import { initDefaultRegistry } from "@/plugin-runtime/model/registry/default-registry";
import {
  getRegisteredPluginIds,
  loadPlugin,
} from "@/plugin-runtime/model/registry/registry";
import { useEffect, useState } from "react";
import type { PluginTabItem } from "../types/types";

function toErrorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Failed to load plugin navigation.";
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

async function loadPluginTabs(
  signal: AbortSignal,
  locale: string,
): Promise<PluginTabItem[] | null> {
  initDefaultRegistry();
  const ids = getRegisteredPluginIds();
  const modules = await Promise.allSettled(ids.map((id) => loadPlugin(id)));
  if (signal.aborted) return null;
  return modules.filter(isFulfilled).map(({ value }) => {
    const normalizedLocale = locale.toLowerCase();
    const localizedMetadata =
      value.manifest.localizedMetadata?.[locale] ??
      value.manifest.localizedMetadata?.[normalizedLocale] ??
      value.manifest.localizedMetadata?.[normalizedLocale.split("-")[0]];

    return {
      id: value.manifest.id,
      displayName: value.manifest.displayName,
      description:
        localizedMetadata?.description ?? value.manifest.description,
    };
  });
}

export function usePluginTabs(locale = "en") {
  const [tabs, setTabs] = useState<PluginTabItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    loadPluginTabs(signal, locale)
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
  }, [locale]);

  return { tabs, error, isLoading };
}
