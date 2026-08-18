

import { PluginPage } from "@/pages/plugin-page";
import { initDefaultRegistry } from "@/plugin-runtime/default-registry";
import { getRegisteredPluginIds } from "@/plugin-runtime/registry";
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

  return <PluginPage routePluginId={pluginId} />;
}
