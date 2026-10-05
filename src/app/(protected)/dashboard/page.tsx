import { MainPluginShell } from "@/features/dashboard-plugin-shell";
import { requiredUser } from "@/shared/lib/server/auth/required-user";

export default async function DashboardPage() {
  await requiredUser();

  return (
    <main className="w-full">
      <header className="mb-10 text-center sm:mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Plugin Dashboard
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Explore and open the tools available in your workspace.
        </p>
      </header>
      <MainPluginShell />
    </main>
  );
}