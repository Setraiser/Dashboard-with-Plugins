import { POST } from "./route";

const mockRegisterUser = jest.fn();

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
    expect(await response.json()).toMatchObject({
      error: "Request validation failed.",
      details: expect.arrayContaining([
        expect.objectContaining({ path: "name" }),
      ]),
    });
  });

  it("returns 400 with a readable error for malformed JSON", async () => {
    const response = await POST({
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    } as Request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Request body must contain valid JSON.",
    });
  });

  it("returns 409 when the user already exists", async () => {
    mockRegisterUser.mockRejectedValue(new Error("USER_ALREADY_EXISTS"));

    const response = await POST(
      createRequest({
        email: "user@example.com",
        password: "secret",
        name: "Alice",
      })
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "An account with this email already exists.",
    });
  });

  it("returns a generic 500 error for unexpected registration failures", async () => {
    mockRegisterUser.mockRejectedValue(new Error("DB_ERROR"));

    const response = await POST(
      createRequest({
        email: "user@example.com",
        password: "secret",
        name: "Alice",
      }),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "An unexpected server error occurred.",
    });
  });
});
