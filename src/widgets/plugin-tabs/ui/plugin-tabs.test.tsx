import { screen } from "@testing-library/react";
import { PluginTabs } from "./plugin-tabs";
import { renderWithIntl } from "@/test/renderWithIntl";

describe("PluginTabs", () => {
  it("renders plugin cards with their titles, descriptions, and active state", () => {
    renderWithIntl(
      <PluginTabs
        items={[
          { id: "todo", displayName: "Todo", description: "Task Manager" },
          { id: "clock", displayName: "Clock", description: "World clock" },
        ]}
        activePluginId="todo"
      />,
    );

    const activeCard = screen.getByRole("link", {
      name: "Todo Task Manager",
    });
    expect(activeCard).toHaveAttribute("href", "/dashboard/todo");
    expect(activeCard).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("World clock")).toBeInTheDocument();
  });

  it("renders nothing when there are no plugins", () => {
    const { container } = renderWithIntl(
      <PluginTabs items={[]} activePluginId={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
