import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TodoWidgetAdapter } from "./adapter";
import todoPlugin from "./index";
import { TodoPriority } from "./entities/todo/modules/types/types";

describe("todo plugin lifecycle", () => {
  it("exposes a dispose cleanup hook", () => {
    expect(typeof todoPlugin.dispose).toBe("function");
    expect(() => todoPlugin.dispose?.()).not.toThrow();
  });

  it("renders when the host does not provide an error reporter", () => {
    const todoApi = {
      getTodos: jest.fn().mockResolvedValue([]),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    expect(() =>
      render(
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(TodoWidgetAdapter, {
            pluginDependencies: { todoApi },
            instanceId: "todo-instance-1",
            config: { title: "Todo" },
          }),
        ),
      ),
    ).not.toThrow();
  });

  it("shows a plugin-owned safe error notification when API loading fails", async () => {
    const todoApi = {
      getTodos: jest.fn().mockRejectedValue(new Error("Database connection failed")),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
        }),
      ),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Не удалось загрузить задачи. Попробуйте ещё раз.",
      );
    });
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "Database connection failed",
    );
    expect(
      screen.getByRole("button", { name: "Закрыть уведомление" }),
    ).toBeInTheDocument();
  });

  it("uses the host error reporter when one is provided", async () => {
    const reportOperationError = jest.fn();
    const todoApi = {
      getTodos: jest.fn().mockRejectedValue(new Error("Database connection failed")),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi, reportOperationError },
          instanceId: "todo-instance-1",
        }),
      ),
    );

    await waitFor(() => {
      expect(reportOperationError).toHaveBeenCalledWith(
        expect.any(Error),
        "Не удалось загрузить задачи. Попробуйте ещё раз.",
      );
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("filters tasks by active and completed status", async () => {
    const todoApi = {
      getTodos: jest.fn().mockResolvedValue([
        {
          id: "active-1",
          text: "Active task",
          completed: false,
          priority: TodoPriority.Low,
        },
        {
          id: "completed-1",
          text: "Completed task",
          completed: true,
          priority: TodoPriority.Low,
        },
      ]),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
        }),
      ),
    );

    expect(await screen.findByLabelText("Task name for Active task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name for Completed task")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Active" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Task name for Active task")).toBeInTheDocument();
      expect(screen.queryByLabelText("Task name for Completed task")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Task name for Completed task")).toBeInTheDocument();
      expect(screen.queryByLabelText("Task name for Active task")).not.toBeInTheDocument();
    });
  });

  it("filters by priority and combines it with the status filter", async () => {
    const todoApi = {
      getTodos: jest.fn().mockResolvedValue([
        {
          id: "high-active",
          text: "High active task",
          completed: false,
          priority: TodoPriority.High,
        },
        {
          id: "high-completed",
          text: "High completed task",
          completed: true,
          priority: TodoPriority.High,
        },
        {
          id: "low-active",
          text: "Low active task",
          completed: false,
          priority: TodoPriority.Low,
        },
      ]),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
        }),
      ),
    );

    expect(await screen.findByLabelText("Task name for High active task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name for High completed task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name for Low active task")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Высокий" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Task name for High active task")).toBeInTheDocument();
      expect(screen.getByLabelText("Task name for High completed task")).toBeInTheDocument();
      expect(screen.queryByLabelText("Task name for Low active task")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Active" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Task name for High active task")).toBeInTheDocument();
      expect(screen.queryByLabelText("Task name for High completed task")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Task name for Low active task")).not.toBeInTheDocument();
    });
  });

  it("debounces task title search without hitting the server", async () => {
    jest.useFakeTimers();

    const todoApi = {
      getTodos: jest.fn().mockResolvedValue([
        { id: "1", text: "Alpha task", completed: false, priority: TodoPriority.Low },
        { id: "2", text: "Beta task", completed: false, priority: TodoPriority.Medium },
      ]),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
        }),
      ),
    );

    const input = await screen.findByLabelText("Search tasks by name");

    fireEvent.change(input, { target: { value: "alp" } });
    expect(screen.getByLabelText("Task name for Alpha task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name for Beta task")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "beta" } });
    expect(screen.getByLabelText("Task name for Alpha task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name for Beta task")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.queryByLabelText("Task name for Alpha task")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Task name for Beta task")).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
