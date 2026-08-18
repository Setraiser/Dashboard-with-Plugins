"use client"

import { usePluginTabs } from "@/features/plugin-navigation";
import { PluginTabs } from "@/widgets/plugin-tabs";

export function MainPluginPage() {
  const { tabs, error, isLoading } = usePluginTabs();

  if (error) return <div role="alert">{error}</div>;
  if (isLoading) return <div>Loading plugins...</div>;

  return (
    <main className={""}>
      <PluginTabs items={tabs} activePluginId={null} />
    </main>
  );
}