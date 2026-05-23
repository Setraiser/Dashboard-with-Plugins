import { registerPlugins } from "./registry";

let initialized = false;

export function initDefaultRegistry(): void {
  if (initialized) return;

  registerPlugins([
    {
      id: "clock",
      loader: () => import("../plugins/clock"),
    },
  ]);

  initialized = true;
}
