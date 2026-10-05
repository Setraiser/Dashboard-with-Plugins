import { render, screen } from "@testing-library/react";

import { PluginShell } from "./plugin-shell";

const mockUsePluginTabs = jest.fn();
const mockReportOperationError = jest.fn();

jest.mock("@/features/plugin-navigation", () => ({
  usePluginTabs: (...args: unknown[]) => mockUsePluginTabs(...args),
  pickActivePluginId: jest.requireActual("@/features/plugin-navigation").pickActivePluginId,
}));

jest.mock("@/app/providers/error-notifications", () => ({
  useReportOperationError: () => mockReportOperationError,
}));

jest.mock("@/plugin-runtime", () => ({
  pluginDependencies: {
    todo: { todoApi: { ok: true } },
  },
}));

jest.mock("@/plugin-runtime/ui", () => ({
  PluginSlot: ({
    plugin,
    dependencies,
  }: {
    plugin: { pluginId: string };
    dependencies: { todo: { reportOperationError?: unknown } };
  }) => (
    <div
      data-testid="plugin-slot"
      data-has-error-reporter={typeof dependencies.todo.reportOperationError === "function"}
    >
      slot:{plugin.pluginId}
    </div>
  ),
}));

describe("plugin shell dashboard rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("mounts the selected plugin without rendering plugin navigation", async () => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [{ id: "todo", displayName: "Todo", description: "Task Manager" }],
      error: null,
      isLoading: false,
    });

    render(<PluginShell routePluginId="todo" />);

    expect(screen.getByTestId("plugin-slot")).toHaveTextContent("slot:todo");
    expect(screen.getByTestId("plugin-slot")).toHaveAttribute(
      "data-has-error-reporter",
      "true",
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("navigation", { name: "Plugin navigation" }),
    ).not.toBeInTheDocument();
  });

  it("shows a fallback alert when the route plugin is not registered", () => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [{ id: "todo", displayName: "Todo", description: "Task Manager" }],
      error: null,
      isLoading: false,
    });

    render(<PluginShell routePluginId="missing" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Plugin route was not found.");
  });

  it("renders an accessible loading state while plugins are loading", () => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [],
      error: null,
      isLoading: true,
    });

    render(<PluginShell routePluginId="todo" />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading plugins...");
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });
});
