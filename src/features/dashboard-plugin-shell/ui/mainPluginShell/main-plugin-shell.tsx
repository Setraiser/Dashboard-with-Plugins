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
      <h2
        id="plugins-heading"
        className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white"
      >
        Plugins
      </h2>
      <PluginTabs items={tabs} activePluginId={null} />
    </section>
  );
}

export default MainPluginShell;
