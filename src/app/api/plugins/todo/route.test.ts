import { DELETE } from "./[id]/route";
import { GET, PATCH, POST } from "./route";
import { ApiError } from "@/shared/lib/server/apiHandler/api-error";
import { ZodError } from "zod";

function createRequest(url: string, init: RequestInit = {}) {
  const body = typeof init.body === "string" ? init.body : undefined;

  return {
    url,
    method: init.method ?? "GET",
    async json() {
      return body ? JSON.parse(body) : {};
    },
  } as Request;
}

const mockGetTodos = jest.fn();
const mockCreateTodo = jest.fn();
const mockUpdateTodos = jest.fn();
const mockDeleteTodo = jest.fn();

const { getCurrentUser: mockGetCurrentUser } = jest.requireMock(
  "@/shared/lib/server/auth/current-user"
) as { getCurrentUser: jest.Mock };

const {
  createTodoSchema: mockCreateTodoSchema,
  updateTodosSchema: mockUpdateTodosSchema,
} = jest.requireMock("@/plugin-host/todo") as {
  createTodoSchema: { parse: jest.Mock };
  updateTodosSchema: { parse: jest.Mock };
};

jest.mock("@/shared/lib/server/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/plugin-host/todo", () => ({
  createTodoSchema: { parse: jest.fn((value) => value) },
  updateTodosSchema: { parse: jest.fn((value) => value) },
}));

jest.mock("@/plugin-host/todo/server/requests/get", () => ({
  getTodos: async (...args: unknown[]) => {
    const user = await (
      jest.requireMock("@/shared/lib/server/auth/current-user") as {
        getCurrentUser: jest.Mock;
      }
    ).getCurrentUser();
    if (!user) {
      const { ApiError } = jest.requireActual(
        "@/shared/lib/server/apiHandler/api-error"
      );
      throw new ApiError(401, "SESSION_EXPIRED");
    }
    return mockGetTodos(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/create", () => ({
  createTodo: async (...args: unknown[]) => {
    const user = await (
      jest.requireMock("@/shared/lib/server/auth/current-user") as {
        getCurrentUser: jest.Mock;
      }
    ).getCurrentUser();
    if (!user) {
      const { ApiError } = jest.requireActual(
        "@/shared/lib/server/apiHandler/api-error"
      );
      throw new ApiError(401, "SESSION_EXPIRED");
    }
    return mockCreateTodo(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/update", () => ({
  updateTodos: async (...args: unknown[]) => {
    const user = await (
      jest.requireMock("@/shared/lib/server/auth/current-user") as {
        getCurrentUser: jest.Mock;
      }
    ).getCurrentUser();
    if (!user) {
      const { ApiError } = jest.requireActual(
        "@/shared/lib/server/apiHandler/api-error"
      );
      throw new ApiError(401, "SESSION_EXPIRED");
    }
    return mockUpdateTodos(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/delete", () => ({
  deleteTodo: async (...args: unknown[]) => {
    const user = await (
      jest.requireMock("@/shared/lib/server/auth/current-user") as {
        getCurrentUser: jest.Mock;
      }
    ).getCurrentUser();
    if (!user) {
      const { ApiError } = jest.requireActual(
        "@/shared/lib/server/apiHandler/api-error"
      );
      throw new ApiError(401, "SESSION_EXPIRED");
    }
    return mockDeleteTodo(...args);
  },
}));

describe("todo plugin API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
  });

  it("accepts JSON, validates it with Zod, checks auth, calls the domain layer, and returns the todo list", async () => {
    const payload = [{ id: "1", text: "Buy milk" }];
    mockGetTodos.mockResolvedValue(payload);

    const response = await GET(
      createRequest("http://localhost/api/plugins/todo")
    );

    expect(await response.json()).toEqual(payload);
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockGetTodos).toHaveBeenCalledWith({});
  });

  it("accepts JSON, validates it with Zod, checks auth, calls the create domain handler, and returns the created todo", async () => {
    const parsed = { text: "Write tests", priority: "high" };
    const payload = { id: "2", text: "Write tests", priority: "high" };
    mockCreateTodoSchema.parse.mockReturnValue(parsed);
    mockCreateTodo.mockResolvedValue(payload);

    const response = await POST(
      createRequest("http://localhost/api/plugins/todo", {
        method: "POST",
        body: JSON.stringify({ text: "Write tests", priority: "high" }),
      })
    );

    expect(mockCreateTodoSchema.parse).toHaveBeenCalledWith({
      text: "Write tests",
      priority: "high",
    });
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockCreateTodo).toHaveBeenCalledWith({
      text: "Write tests",
      priority: "high",
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(payload);
  });

  it("accepts JSON, validates it with Zod, checks auth, calls the update domain handler, and returns the updated items", async () => {
    const parsed = [{ id: "2", text: "Write tests", priority: "low" }];
    const payload = [{ id: "2", text: "Write tests", priority: "low" }];
    mockUpdateTodosSchema.parse.mockReturnValue(parsed);
    mockUpdateTodos.mockResolvedValue(payload);

    const response = await PATCH(
      createRequest("http://localhost/api/plugins/todo", {
        method: "PATCH",
        body: JSON.stringify({
          items: [{ id: "2", text: "Write tests", priority: "low" }],
        }),
      })
    );

    expect(mockUpdateTodosSchema.parse).toHaveBeenCalledWith({
      items: [{ id: "2", text: "Write tests", priority: "low" }],
    });
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockUpdateTodos).toHaveBeenCalledWith(parsed);
    expect(await response.json()).toEqual(payload);
  });

  it("checks auth before deleting a todo item and returns the correct HTTP response", async () => {
    const payload = { ok: true, id: "42" };
    mockDeleteTodo.mockResolvedValue(payload);

    const response = await DELETE(
      createRequest("http://localhost/api/plugins/todo/42", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "42" }) }
    );

    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockDeleteTodo).toHaveBeenCalledWith({ id: "42" });
    expect(await response.json()).toEqual(payload);
  });

  it("returns a 401 response when the request is not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const response = await POST(
      createRequest("http://localhost/api/plugins/todo", {
        method: "POST",
        body: JSON.stringify({ text: "Write tests", priority: "high" }),
      })
    );

    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: { code: "SESSION_EXPIRED" },
    });
  });

  it("returns a 400 response for invalid todo input", async () => {
    mockCreateTodoSchema.parse.mockImplementation(() => {
      throw new ZodError([
        {
          code: "custom",
          path: ["text"],
          message: "Invalid text",
        },
      ]);
    });

    const response = await POST(
      createRequest("http://localhost/api/plugins/todo", {
        method: "POST",
        body: JSON.stringify({ text: "", priority: "high" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        details: {
          issues: [expect.objectContaining({ path: "text" })],
        },
      },
    });
  });

  it("returns 404 when a todo does not exist", async () => {
    mockDeleteTodo.mockRejectedValue(new ApiError(404, "TODO_NOT_FOUND"));

    const response = await DELETE(
      createRequest("http://localhost/api/plugins/todo/missing", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "missing" }) },
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: { code: "TODO_NOT_FOUND" },
    });
  });

  it("preserves a successful no-content response from the delete handler", async () => {
    mockDeleteTodo.mockResolvedValue(new Response(null, { status: 204 }));

    const response = await DELETE(
      createRequest("http://localhost/api/plugins/todo/42", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: "42" }) },
    );

    expect(response.status).toBe(204);
  });
});
