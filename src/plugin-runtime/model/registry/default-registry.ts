import { registerPlugins } from "./registry";

let initialized = false;

export function initDefaultRegistry(): void {
  if (initialized) return;

  registerPlugins([
    {
      id: "todo",
      loader: () => import("@/plugins/todo"),
    },
    {
      id: "falling-clicker",
      loader: () => import("@/plugins/falling-clicker"),
    },
  ]);

  initialized = true;
}
