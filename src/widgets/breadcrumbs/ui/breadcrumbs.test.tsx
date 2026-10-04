import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./breadcrumbs";

const mockUsePathname = jest.fn();
const mockUsePluginTabs = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("@/features/plugin-navigation", () => ({
  usePluginTabs: () => mockUsePluginTabs(),
}));

describe("Breadcrumbs", () => {
  beforeEach(() => {
    mockUsePluginTabs.mockReturnValue({
      tabs: [{ id: "todo", displayName: "Todo list" }],
    });
  });

  it("shows the dashboard, plugins, and active plugin hierarchy", () => {
    mockUsePathname.mockReturnValue("/dashboard/plugins/todo");

    render(<Breadcrumbs />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Plugins" })).toHaveAttribute(
      "href",
      "/dashboard/plugins",
    );
    expect(screen.getByText("Todo list")).toHaveAttribute("aria-current", "page");
  });

  it("marks dashboard as the current page on the dashboard route", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    render(<Breadcrumbs />);

    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });
});
