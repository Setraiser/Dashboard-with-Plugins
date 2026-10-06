import { apiClient } from "./apiClient";

describe("apiClient", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("throws the stable API error code from the structured error contract", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 409,
      text: async () =>
        JSON.stringify({ error: { code: "EMAIL_ALREADY_EXISTS" } }),
    });

    await expect(apiClient("/api/auth/register")).rejects.toMatchObject({
      status: 409,
      code: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("maps responses without a code to a safe code using the HTTP status", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: { details: { field: "email" } } }),
    });

    await expect(apiClient("/api/plugins/todo")).rejects.toMatchObject({
      status: 401,
      code: "SESSION_EXPIRED",
      details: { field: "email" },
    });
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
