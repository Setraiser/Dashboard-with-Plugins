const mockDestroySession = jest.fn();
const mockRedirect = jest.fn();

jest.mock("@/shared/lib/server/auth/session", () => ({
  destroySession: () => mockDestroySession(),
}));

jest.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

import { logout } from "./logout";

describe("logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("destroys the session and redirects to login", async () => {
    await logout();

    expect(mockDestroySession).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("does not redirect if destroying the session fails", async () => {
    const error = new Error("Session cleanup failed");
    mockDestroySession.mockRejectedValueOnce(error);

    await expect(logout()).rejects.toBe(error);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
