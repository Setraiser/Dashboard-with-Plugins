import { DELETE } from "./[id]/route";
import { GET, PATCH, POST } from "./route";

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

const { requiredUser: mockRequiredUser } = jest.requireMock(
  "@/shared/lib/server/auth/required-user"
) as { requiredUser: jest.Mock };

const {
  createTodoSchema: mockCreateTodoSchema,
  updateTodosSchema: mockUpdateTodosSchema,
} = jest.requireMock("@/plugin-host/todo") as {
  createTodoSchema: { parse: jest.Mock };
  updateTodosSchema: { parse: jest.Mock };
};

jest.mock("@/shared/lib/server/auth/required-user", () => ({
  requiredUser: jest.fn(),
}));

jest.mock("@/plugin-host/todo", () => ({
  createTodoSchema: { parse: jest.fn((value) => value) },
  updateTodosSchema: { parse: jest.fn((value) => value) },
}));

jest.mock("@/plugin-host/todo/server/requests/get", () => ({
  getTodos: async (...args: unknown[]) => {
    await (
      jest.requireMock("@/shared/lib/server/auth/required-user") as {
        requiredUser: jest.Mock;
      }
    ).requiredUser();
    return mockGetTodos(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/create", () => ({
  createTodo: async (...args: unknown[]) => {
    await (
      jest.requireMock("@/shared/lib/server/auth/required-user") as {
        requiredUser: jest.Mock;
      }
    ).requiredUser();
    return mockCreateTodo(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/update", () => ({
  updateTodos: async (...args: unknown[]) => {
    await (
      jest.requireMock("@/shared/lib/server/auth/required-user") as {
        requiredUser: jest.Mock;
      }
    ).requiredUser();
    return mockUpdateTodos(...args);
  },
}));

jest.mock("@/plugin-host/todo/server/requests/delete", () => ({
  deleteTodo: async (...args: unknown[]) => {
    await (
      jest.requireMock("@/shared/lib/server/auth/required-user") as {
        requiredUser: jest.Mock;
      }
    ).requiredUser();
    return mockDeleteTodo(...args);
  },
}));

describe("todo plugin API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequiredUser.mockResolvedValue({ id: "user-1" });
  });

  it("accepts JSON, validates it with Zod, checks auth, calls the domain layer, and returns the todo list", async () => {
    const payload = [{ id: "1", text: "Buy milk" }];
    mockGetTodos.mockResolvedValue(payload);

    const response = await GET(
      createRequest("http://localhost/api/plugins/todo")
    );

    expect(await response.json()).toEqual(payload);
    expect(mockRequiredUser).toHaveBeenCalledTimes(1);
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
    expect(mockRequiredUser).toHaveBeenCalledTimes(1);
    expect(mockCreateTodo).toHaveBeenCalledWith({
      text: "Write tests",
      priority: "high",
    });
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
    expect(mockRequiredUser).toHaveBeenCalledTimes(1);
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

    expect(mockRequiredUser).toHaveBeenCalledTimes(1);
    expect(mockDeleteTodo).toHaveBeenCalledWith({ id: "42" });
    expect(await response.json()).toEqual(payload);
  });

  it("returns a 500 response when the request is not authenticated or the service fails", async () => {
    mockRequiredUser.mockRejectedValue(new Error("Unauthorized"));

    const response = await POST(
      createRequest("http://localhost/api/plugins/todo", {
        method: "POST",
        body: JSON.stringify({ text: "Write tests", priority: "high" }),
      })
    );

    expect(mockRequiredUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });
  });
});
