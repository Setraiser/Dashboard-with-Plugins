import { render, screen } from "@testing-library/react";

import { UserMenu } from "./UserMenu";

jest.mock("../../server/logout", () => ({
  logout: jest.fn(),
}));

describe("UserMenu", () => {
  it("shows the current user's name and a logout button", () => {
    render(
      <UserMenu
        user={{
          id: "user-1",
          email: "alex@example.com",
          name: "Alex",
        }}
      />,
    );

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Выйти" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("button", { name: "Выйти" }).closest("form")).toBeInTheDocument();
  });
});
