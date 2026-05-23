import { render, screen, waitFor } from "@testing-library/react";
import { DashboardShell } from "./dashboard-shell";

describe("DashboardShell", () => {
  it("renders plugin slot loading state", async () => {
    render(<DashboardShell />);

    await waitFor(() => {
      expect(screen.getByText("Loading plugin...")).toBeInTheDocument();
    });
  });
});
