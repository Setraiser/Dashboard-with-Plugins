import { UserMenu } from "@/features/dashboard-user";
import { requiredUser } from "@/shared/lib/server/auth/required-user";
import { Breadcrumbs } from "@/widgets/breadcrumbs";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requiredUser();

  return (
    <div className="min-h-screen px-4 pb-12 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-700/70 dark:bg-slate-900/55">
          <Breadcrumbs />
          <UserMenu user={user} />
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
