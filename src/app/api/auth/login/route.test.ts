import { POST } from "./route";

const mockLogin = jest.fn();
const mockNextResponseJson = jest.fn(
  (body: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    json: async () => body,
  })
);

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: Parameters<typeof mockNextResponseJson>) =>
      mockNextResponseJson(...args),
  },
}));

jest.mock("@/features/auth/login/server/login", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}));

describe("auth login endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRequest(body: unknown) {
    return {
      json: async () => body,
    } as Request;
  }

  it("accepts JSON, calls the login service, and returns the current user payload", async () => {
    const payload = { id: "u-1", email: "user@example.com" };
    mockLogin.mockResolvedValue(payload);

    const response = await POST(
      createRequest({ email: "user@example.com", password: "secret" })
    );

    expect(mockLogin).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  it("returns 401 when login rejects with INVALID_CREDENTIALS", async () => {
    mockLogin.mockRejectedValue(new Error("INVALID_CREDENTIALS"));

    const response = await POST(
      createRequest({ email: "user@example.com", password: "bad" })
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Invalid email or password",
    });
  });

  it("returns 500 on unexpected login failures", async () => {
    mockLogin.mockRejectedValue(new Error("DB_ERROR"));

    const response = await POST(
      createRequest({ email: "user@example.com", password: "secret" })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: "Internal server error" });
  });
});
