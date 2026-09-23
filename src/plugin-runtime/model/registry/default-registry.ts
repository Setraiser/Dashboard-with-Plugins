import { registerPlugins } from "./registry";

let initialized = false;

export function initDefaultRegistry(): void {
  if (initialized) return;

  registerPlugins([
    {
      id: "todo",
      loader: () => import("@/plugins/todo"),
    },
  ]);

  initialized = true;
}
