import { Breadcrumbs } from "@/widgets/breadcrumbs";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <div className="mt-2">{children}</div>
    </div>
  );
}
