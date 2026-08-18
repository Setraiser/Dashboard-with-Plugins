import { requiredUser } from "@/shared/lib/server/auth/required-user";
import Link from "next/link";

export default async function DashboardPage() {

  await requiredUser();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>

      <Link href={"/dashboard/plugins"}>View Plugins</Link>
    </div>
  );
}