import { screen } from "@testing-library/react";

import { renderWithIntl } from "@/test/renderWithIntl";
import { UserMenu } from "./UserMenu";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("../../server/logout", () => ({
  logout: jest.fn(),
}));

describe("UserMenu", () => {
  it("shows the current user's name and a logout button", () => {
    renderWithIntl(
      <UserMenu
        user={{
          id: "user-1",
          email: "alex@example.com",
          name: "Alex",
        }}
      />,
      { locale: "ru" },
    );

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Выйти" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("button", { name: "Выйти" }).closest("form")).toBeInTheDocument();
  });
});
