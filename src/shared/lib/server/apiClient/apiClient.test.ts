import { apiClient } from "./apiClient";

describe("apiClient", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("throws the API error message from the unified error contract", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 409,
      text: async () =>
        JSON.stringify({ error: "An account with this email already exists." }),
    });

    await expect(apiClient("/api/auth/register")).rejects.toThrow(
      "An account with this email already exists.",
    );
  });

  it("supports legacy message fields while callers transition to the error contract", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: "Sign in is required." }),
    });

    await expect(apiClient("/api/plugins/todo")).rejects.toThrow(
      "Sign in is required.",
    );
  });

  it("returns undefined for a successful no-content response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
      text: async () => "",
    });

    await expect(apiClient<void>("/api/plugins/todo/1")).resolves.toBeUndefined();
  });
});
