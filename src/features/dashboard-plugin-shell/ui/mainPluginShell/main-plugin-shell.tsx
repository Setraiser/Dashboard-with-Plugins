"use client";

import { usePluginTabs } from "@/features/plugin-navigation";
import { LoadingState } from "@/shared/ui/loading-state";
import { PluginTabs } from "@/widgets/plugin-tabs";

export function MainPluginShell() {
  const { tabs, error, isLoading } = usePluginTabs();

  if (error) return <div role="alert">{error}</div>;
  if (isLoading) return <LoadingState label="Loading plugins..." />;

  return (
    <section className="mr-auto w-full max-w-6xl text-left" aria-labelledby="plugins-heading">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            Get started
          </p>
          <h2
            id="plugins-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
          >
            Your plugins
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Choose a tool to continue
        </p>
      </div>
      <div className="rounded-[1.75rem] border border-white/80 bg-white/60 p-3 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-5 dark:border-slate-700/70 dark:bg-slate-900/45">
        <PluginTabs items={tabs} activePluginId={null} />
      </div>
    </section>
  );
}

export default MainPluginShell;
