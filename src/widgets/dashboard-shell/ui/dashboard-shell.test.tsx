import { render, screen } from "@testing-library/react";
import { DashboardShell } from "./dashboard-shell";

describe("DashboardShell", () => {
  it("renders plugin slot loading state", () => {
    render(<DashboardShell />);
    expect(screen.getByText("Loading plugin...")).toBeInTheDocument();
  });
});
