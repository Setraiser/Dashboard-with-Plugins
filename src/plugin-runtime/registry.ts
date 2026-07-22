import type { PluginLoader, PluginModule } from "./types";
import { validateManifest } from "./validation";

interface RegisteredPlugin {
  id: string;
  loader: PluginLoader;
}

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
  const errors = validateManifest(pluginModule.manifest);
  if (errors.length > 0) {
    throw new Error(
      `Plugin "${pluginId}" manifest is invalid: ${errors.join(" ")}`
    );
  }

  return pluginModule;
}
