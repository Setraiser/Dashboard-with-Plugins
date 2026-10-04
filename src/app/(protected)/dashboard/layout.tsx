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
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between md:mb-6">
        <Breadcrumbs />
        <UserMenu user={user} />
      </header>
      <div className="mt-2">{children}</div>
    </div>
  );
}
