import { render, screen } from "@testing-library/react";

import { PluginShell } from "./plugin-shell";

const mockUsePluginTabs = jest.fn();

jest.mock("@/features/plugin-navigation", () => ({
  usePluginTabs: (...args: unknown[]) => mockUsePluginTabs(...args),
  pickActivePluginId: jest.requireActual("@/features/plugin-navigation").pickActivePluginId,
}));

jest.mock("@/plugin-runtime", () => ({
  pluginDependencies: {
    todo: { todoApi: { ok: true } },
  },
}));

jest.mock("@/plugin-runtime/ui", () => ({
  PluginSlot: ({ plugin }: { plugin: { pluginId: string } }) => (
    <div data-testid="plugin-slot">slot:{plugin.pluginId}</div>
  ),
}));

jest.mock("@/widgets/plugin-tabs", () => ({
  PluginTabs: ({ items, activePluginId }: { items: { id: string; displayName: string }[]; activePluginId: string | null }) => (
    <nav aria-label="Plugin navigation">
      <span data-testid="active-plugin-id">{activePluginId ?? "none"}</span>
      {items.map((item) => (
        <span key={item.id}>{item.displayName}</span>
      ))}
    </nav>
  ),
}));

describe("plugin shell dashboard rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: async () => ({
          widgets: [{ pluginId: "todo", instanceId: "todo-instance-1" }],
        }),
      } as Response),
    );
  });

  it("renders the active plugin tab and mounts the selected plugin slot", async () => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [{ id: "todo", displayName: "Todo" }],
      error: null,
      isLoading: false,
    });

    render(<PluginShell routePluginId="todo" />);

    expect(screen.getByTestId("active-plugin-id")).toHaveTextContent("todo");
    expect(screen.getByText("Todo")).toBeInTheDocument();
    expect(screen.getByTestId("plugin-slot")).toHaveTextContent("slot:todo");
  });

  it("shows a fallback alert when the route plugin is not registered", () => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [{ id: "todo", displayName: "Todo" }],
      error: null,
      isLoading: false,
    });

    render(<PluginShell routePluginId="missing" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Plugin route was not found.");
  });
});
