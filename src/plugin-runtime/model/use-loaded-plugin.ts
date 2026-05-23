"use client";

import { useEffect, useRef, useState } from "react";
import { loadPlugin } from "../registry";
import type { PluginModule } from "../types";

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown plugin error";
}

export function useLoadedPlugin(pluginId: string) {
  const activeModuleRef = useRef<PluginModule | null>(null);
  const [loadedPluginId, setLoadedPluginId] = useState<string | null>(null);
  const [module, setModule] = useState<PluginModule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadPlugin(pluginId)
      .then((loaded) => {
        if (cancelled) {
          loaded.dispose?.();
          return;
        }

        activeModuleRef.current?.dispose?.();
        activeModuleRef.current = loaded;
        setModule(loaded);
        setError(null);
        setLoadedPluginId(pluginId);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        activeModuleRef.current?.dispose?.();
        activeModuleRef.current = null;
        setModule(null);
        setError(toErrorMessage(err));
        setLoadedPluginId(pluginId);
      });

    return () => {
      cancelled = true;
    };
  }, [pluginId]);

  useEffect(() => {
    return () => {
      activeModuleRef.current?.dispose?.();
      activeModuleRef.current = null;
    };
  }, []);

  const isLoading = loadedPluginId !== pluginId || (!module && !error);

  return { module, error, isLoading };
}
