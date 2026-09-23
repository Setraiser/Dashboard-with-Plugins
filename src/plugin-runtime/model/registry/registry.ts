import { PluginLoader, PluginModule } from "../types/plugin-runtime-types";
import { RegisteredPlugin } from "../types/registry";

const pluginMap = new Map<string, PluginLoader>();

export function registerPlugins(plugins: RegisteredPlugin[]): void {
  for (const plugin of plugins) {
    if (pluginMap.has(plugin.id)) {
      throw new Error(`Plugin "${plugin.id}" is already registered.`);
    }
    pluginMap.set(plugin.id, plugin.loader);
  }
}

export function getRegisteredPluginIds(): string[] {
  return Array.from(pluginMap.keys());
}

export async function loadPlugin(pluginId: string): Promise<PluginModule> {
  const loader = pluginMap.get(pluginId);
  if (!loader) {
    throw new Error(`Plugin "${pluginId}" is not registered.`);
  }

  const loadedModule = await loader();
  const pluginModule = loadedModule.default;

  return pluginModule;
}
