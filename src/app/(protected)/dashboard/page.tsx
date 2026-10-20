import { MainPluginShell } from "@/features/dashboard-plugin-shell";
import { requiredUser } from "@/shared/lib/server/auth/required-user";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  await requiredUser();
  const t = await getTranslations("dashboard");

  return (
    <main className="w-full">
      <header className="mb-12 max-w-3xl border-l-2 border-[#a34d36] py-1 pl-5 sm:mb-16 sm:pl-7">
        <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-[#8d4935] dark:text-[#d18468]">
          {t("eyebrow")}
        </p>
        <h1 className="font-serif text-4xl font-medium leading-tight tracking-[-0.035em] text-[#282923] sm:text-6xl dark:text-[#f0eee7]">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#686960] sm:text-lg dark:text-[#b4b4aa]">
          {t("description")}
        </p>
      </header>
      <MainPluginShell />
    </main>
  );
}