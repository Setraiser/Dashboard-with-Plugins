import { TodoPriority } from "@/plugins/todo";
import { todoApi } from "./todoApi";

describe("todoApi", () => {
  const mockFetch = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("converts server enum values to the plugin priority enum", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify([
          { id: "1", text: "Low", completed: false, priority: "Low" },
          { id: "2", text: "Medium", completed: false, priority: "Medium" },
          { id: "3", text: "High", completed: false, priority: "High" },
        ]),
    });

    await expect(todoApi.getTodos()).resolves.toEqual([
      { id: "1", text: "Low", completed: false, priority: TodoPriority.Low },
      { id: "2", text: "Medium", completed: false, priority: TodoPriority.Medium },
      { id: "3", text: "High", completed: false, priority: TodoPriority.High },
    ]);
  });
});
