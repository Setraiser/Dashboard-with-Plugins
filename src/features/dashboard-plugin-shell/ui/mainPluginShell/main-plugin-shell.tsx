"use client";

import { usePluginTabs } from "@/features/plugin-navigation";
import { LoadingState } from "@/shared/ui/loading-state";
import { PluginTabs } from "@/widgets/plugin-tabs";
import { useLocale, useTranslations } from "next-intl";

export function MainPluginShell() {
  const locale = useLocale();
  const t = useTranslations();
  const { tabs, error, isLoading } = usePluginTabs(locale);

  if (error) return <div role="alert">{t("runtime.navigationFailed")}</div>;
  if (isLoading) return <LoadingState label={t("runtime.loadingPlugins")} />;

  return (
    <section className="mr-auto w-full text-left" aria-labelledby="plugins-heading">
      <div className="mb-6 flex flex-col gap-3 border-b border-[#d9d5ca] pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-[#45473f]">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[#8d4935] dark:text-[#d18468]">
            {t("pluginCatalog.eyebrow")}
          </p>
          <h2
            id="plugins-heading"
            className="font-serif text-3xl font-medium tracking-tight text-[#282923] sm:text-4xl dark:text-[#f0eee7]"
          >
            {t("pluginCatalog.title")}
          </h2>
        </div>
        <p className="text-sm text-[#686960] dark:text-[#b4b4aa]">
          {t("pluginCatalog.description")}
        </p>
      </div>
      <PluginTabs items={tabs} activePluginId={null} />
    </section>
  );
}

export default MainPluginShell;
