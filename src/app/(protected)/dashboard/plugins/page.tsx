import { MainPluginShell } from "@/features/dashboard-plugin-shell";
import { requiredUser } from "@/shared/lib/server/auth/required-user";

export default async function PluginsPage() {
  await requiredUser();

  return <MainPluginShell />;
}