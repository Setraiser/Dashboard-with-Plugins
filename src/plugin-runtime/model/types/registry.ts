import { PluginLoader } from "./plugin-runtime-types";
export interface RegisteredPlugin {
  id: string;
  loader: PluginLoader;
}
