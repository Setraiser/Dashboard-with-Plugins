import { notFound } from "next/navigation";
import { initDefaultRegistry } from "@/plugin-runtime/default-registry";
import { getRegisteredPluginIds } from "@/plugin-runtime/registry";
import { PluginPage } from "@/pages/plugin-page";

interface PluginRoutePageProps {
  params: Promise<{ pluginId: string }>;
}

export default async function PluginRoutePage({ params }: PluginRoutePageProps) {
  const { pluginId } = await params;

  initDefaultRegistry();
  if (!getRegisteredPluginIds().includes(pluginId)) {
    notFound();
  }

  return <PluginPage routePluginId={pluginId} />;
}
