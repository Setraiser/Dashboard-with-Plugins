import { MainPluginShell } from "@/features/dashboard-plugin-shell";
import { requiredUser } from "@/shared/lib/server/auth/required-user";

export default async function DashboardPage() {
  await requiredUser();

  return (
    <main className="w-full">
      <header className="relative isolate mb-10 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 px-5 py-10 text-center shadow-xl shadow-indigo-950/5 backdrop-blur sm:mb-12 sm:px-10 sm:py-14 dark:border-slate-700/70 dark:bg-slate-900/70">
        <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/15" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-16 -z-10 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl dark:bg-teal-500/10" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
          Your creative workspace
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          Plugin Dashboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          Explore and open the tools available in your workspace.
        </p>
      </header>
      <MainPluginShell />
    </main>
  );
}