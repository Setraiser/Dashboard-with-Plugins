import { validateManifest } from "./validation";
import type { PluginManifest } from "./types";

describe("plugin manifest validation", () => {
  it("accepts compatible manifest", () => {
    const manifest: PluginManifest = {
      id: "clock",
      version: "1.0.0",
      apiVersion: "1.0.0",
      displayName: "Clock",
      slots: ["dashboard.main"],
    };

    expect(validateManifest(manifest)).toEqual([]);
  });

  it("rejects incompatible api version", () => {
    const manifest: PluginManifest = {
      id: "clock",
      version: "1.0.0",
      apiVersion: "2.0.0",
      displayName: "Clock",
      slots: ["dashboard.main"],
    };

    expect(validateManifest(manifest)).not.toEqual([]);
  });
});
