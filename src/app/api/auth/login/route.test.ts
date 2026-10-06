import { POST } from "./route";

const mockLogin = jest.fn();

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
      error: { code: "INVALID_CREDENTIALS" },
    });
  });

  it("returns 500 on unexpected login failures", async () => {
    mockLogin.mockRejectedValue(new Error("DB_ERROR"));

    const response = await POST(
      createRequest({ email: "user@example.com", password: "secret" })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { code: "INTERNAL_ERROR" },
    });
  });

  it("returns a readable 400 error for malformed JSON", async () => {
    const response = await POST({
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    } as Request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_JSON" },
    });
  });

  it("returns 400 when the login payload is invalid", async () => {
    const response = await POST(createRequest({ email: "invalid", password: "" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        details: {
          issues: expect.arrayContaining([
            expect.objectContaining({ path: "email" }),
            expect.objectContaining({ path: "password" }),
          ]),
        },
      },
    });

  });
});
