import { POST } from "./route";

const mockRegisterUser = jest.fn();
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

jest.mock("@/features/auth/register/server/register", () => ({
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
}));

describe("auth register endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRequest(body: unknown) {
    return {
      json: async () => body,
    } as Request;
  }

  it("accepts JSON, validates required fields, calls the register service, and returns 201", async () => {
    const payload = { id: "u-1", email: "user@example.com" };
    mockRegisterUser.mockResolvedValue(payload);

    const response = await POST(
      createRequest({
        email: "user@example.com",
        password: "secret",
        name: "Alice",
      })
    );

    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret",
      name: "Alice",
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(payload);
  });

  it("returns 400 if required fields are missing", async () => {
    const response = await POST(
      createRequest({ email: "user@example.com", password: "secret" })
    );

    expect(mockRegisterUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Email, name and password are required",
    });
  });

  it("returns 400 when the user already exists", async () => {
    mockRegisterUser.mockRejectedValue(new Error("USER_ALREADY_EXISTS"));

    const response = await POST(
      createRequest({
        email: "user@example.com",
        password: "secret",
        name: "Alice",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "User already exists" });
  });

  it("rethrows unexpected registration errors", async () => {
    mockRegisterUser.mockRejectedValue(new Error("DB_ERROR"));

    await expect(
      POST(
        createRequest({
          email: "user@example.com",
          password: "secret",
          name: "Alice",
        })
      )
    ).rejects.toThrow("DB_ERROR");
  });
});
