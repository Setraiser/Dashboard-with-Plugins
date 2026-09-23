

import { PluginShell } from "@/features/dashboard-plugin-shell";
import { initDefaultRegistry } from "@/plugin-runtime/model/registry/default-registry";
import { getRegisteredPluginIds } from "@/plugin-runtime/model/registry/registry";
import { requiredUser } from "@/shared/lib/server/auth/required-user";
import { notFound, redirect } from "next/navigation";

interface PluginRoutePageProps {
  params: Promise<{ pluginId: string }>;
}

export default async function PluginRoutePage({ params }: PluginRoutePageProps) {
  await requiredUser();


  const { pluginId } = await params;
  const firstPluginId = getRegisteredPluginIds()[0];

  if (!pluginId && firstPluginId) {
    redirect(`/dashboard/plugins/${firstPluginId}`);
  }

  initDefaultRegistry();
  if (!getRegisteredPluginIds().includes(pluginId)) {
    notFound();
  }

  return <PluginShell routePluginId={pluginId} />;
}
