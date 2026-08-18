import { MainPluginPage } from "@/pages/main-plugin-page";
import { requiredUser } from "@/shared/lib/server/auth/required-user";
export default async function PluginsPage() {
  await requiredUser();

  return (
    <MainPluginPage />
  );
}