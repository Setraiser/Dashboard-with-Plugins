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
    <div className="min-h-screen px-5 pb-16 pt-5 sm:px-8 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-4 border-b border-[#d9d5ca] pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#45473f]">
          <Breadcrumbs />
          <UserMenu user={user} />
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
