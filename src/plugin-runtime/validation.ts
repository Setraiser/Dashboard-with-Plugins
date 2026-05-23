import { PLUGIN_API_VERSION, type PluginManifest } from "./types";

const semverLike = /^\d+\.\d+\.\d+$/;

export function validateManifest(manifest: PluginManifest): string[] {
  const errors: string[] = [];

  if (!manifest.id.trim()) errors.push("Manifest id is required.");
  if (!semverLike.test(manifest.version)) {
    errors.push("Manifest version must follow x.y.z.");
  }
  if (manifest.apiVersion !== PLUGIN_API_VERSION) {
    errors.push(
      `Unsupported apiVersion "${manifest.apiVersion}". Expected "${PLUGIN_API_VERSION}".`,
    );
  }
  if (!manifest.displayName.trim()) errors.push("Display name is required.");
  if (!manifest.slots.length) errors.push("At least one slot is required.");

  return errors;
}

export function validateConfig(
  manifest: PluginManifest,
  rawConfig: unknown,
): unknown {
  if (!manifest.configSchema) return rawConfig;
  return manifest.configSchema.parse(rawConfig);
}
