import { render, screen } from "@testing-library/react";
import { PluginTabs } from "./plugin-tabs";

describe("PluginTabs", () => {
  it("renders plugin cards with their titles, descriptions, and active state", () => {
    render(
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
    const { container } = render(
      <PluginTabs items={[]} activePluginId={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
