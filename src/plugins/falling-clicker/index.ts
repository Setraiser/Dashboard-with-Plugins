import { FallingClickerWidgetAdapter } from "./adapter";

/** Типы API плагина, доступные host-приложению при интеграции. */
export type {
  FallingClickerApi,
  FallingClickerDependencies,
} from "./types/falling-clicker-api";

/** Метаданные и React-адаптер, используемые реестром плагинов. */
const fallingClickerPlugin = {
  manifest: {
    id: "falling-clicker",
    version: "1.0.0",
    displayName: "Falling Clicker",
    description: "A fast-paced falling object clicker game",
    localizedMetadata: {
      en: { description: "A fast-paced falling object clicker game" },
      ru: { description: "Игра на реакцию с падающими фигурами" },
    },
  },
  Widget: FallingClickerWidgetAdapter,
};

export default fallingClickerPlugin;
