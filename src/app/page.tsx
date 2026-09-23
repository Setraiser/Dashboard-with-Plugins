import { PluginShell } from "@/features/dashboard-plugin-shell";
import { requiredUser } from "@/shared/lib/server/auth/required-user";

export default async function DashboardPage() {
  await requiredUser();
  return <PluginShell />;
}
