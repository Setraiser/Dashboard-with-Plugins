import { renderHook, waitFor } from "@testing-library/react";

import { pickActivePluginId } from "../functions/pick-active-plugin-id";
import { usePluginTabs } from "./use-plugin-tabs";

jest.mock("@/plugin-runtime/model/registry/default-registry", () => ({
  initDefaultRegistry: jest.fn(),
}));

const mockGetRegisteredPluginIds = jest.fn();
const mockLoadPlugin = jest.fn();

jest.mock("@/plugin-runtime/model/registry/registry", () => ({
  getRegisteredPluginIds: (...args: unknown[]) => mockGetRegisteredPluginIds(...args),
  loadPlugin: (...args: unknown[]) => mockLoadPlugin(...args),
}));

describe("plugin navigation dashboard wiring", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes registry and loads tab metadata for each registered plugin", async () => {
    mockGetRegisteredPluginIds.mockReturnValue(["todo", "clock"]);
    mockLoadPlugin.mockImplementation(async (id: string) => ({
      manifest: {
        id,
        displayName: id === "todo" ? "Todo" : "Clock",
        description: id === "todo" ? "Task Manager" : "Clock",
      },
    }));

    const { result } = renderHook(() => usePluginTabs());

    await waitFor(() => {
      expect(result.current.tabs).toEqual([
        { id: "todo", displayName: "Todo", description: "Task Manager" },
        { id: "clock", displayName: "Clock", description: "Clock" },
      ]);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockLoadPlugin).toHaveBeenCalledTimes(2);
  });

  it("ignores rejected plugin loads and keeps the remaining tabs available", async () => {
    mockGetRegisteredPluginIds.mockReturnValue(["todo", "clock"]);
    mockLoadPlugin.mockImplementation(async (id: string) => {
      if (id === "clock") {
        throw new Error("Clock plugin failed");
      }

      return {
        manifest: {
          id: "todo",
          displayName: "Todo",
          description: "Task Manager",
        },
      };
    });

    const { result } = renderHook(() => usePluginTabs());

    await waitFor(() => {
      expect(result.current.tabs).toEqual([
        { id: "todo", displayName: "Todo", description: "Task Manager" },
      ]);
    });

    expect(result.current.error).toBeNull();
  });

  it("drops all failed plugin loads without turning them into a fatal dashboard error", async () => {
    mockGetRegisteredPluginIds.mockReturnValue(["todo"]);
    mockLoadPlugin.mockRejectedValue(new Error("Failed to load plugin"));

    const { result } = renderHook(() => usePluginTabs());

    await waitFor(() => {
      expect(result.current.tabs).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("picks the first route tab or rejects an unknown active plugin id", () => {
    const tabs = [
      { id: "todo", displayName: "Todo", description: "Task Manager" },
      { id: "clock", displayName: "Clock", description: "Clock" },
    ];

    expect(pickActivePluginId(undefined, tabs)).toBe("todo");
    expect(pickActivePluginId("clock", tabs)).toBe("clock");
    expect(pickActivePluginId("unknown", tabs)).toBeNull();
  });
});
