import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TodoWidgetAdapter } from "./adapter";
import todoPlugin from "./index";
import { TodoPriority } from "./entities/todo/modules/types/types";
import { TodoI18nProvider } from "./i18n/todo-i18n-provider";

function MissingTranslationProbe() {
  const t = useTranslations("common");
  const missingKey = ["missing", "key"].join(".");
  return React.createElement("span", null, t(missingKey));
}

describe("todo plugin lifecycle", () => {
  it("exposes a dispose cleanup hook", () => {
    expect(typeof todoPlugin.dispose).toBe("function");
    expect(() => todoPlugin.dispose?.()).not.toThrow();
  });

  it("renders English plugin-owned strings without an error reporter", async () => {
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
    );

    expect(await screen.findByRole("button", { name: "Add task" })).toBeInTheDocument();
    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
  });

  it("renders plugin-owned Russian strings when given a generic locale", async () => {
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

    render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
          locale: "ru-RU",
        }),
      ),
    );

    expect(await screen.findByText("Todo")).toBeInTheDocument();
    expect(screen.getByLabelText("Поиск задач по названию")).toBeInTheDocument();
    expect(screen.getByText("Пока нет задач.")).toBeInTheDocument();
  });

  it("uses the safe plugin fallback for unsupported locales and missing keys", () => {
    render(
      React.createElement(
        TodoI18nProvider,
        { locale: "fr" },
        React.createElement(MissingTranslationProbe),
      ),
    );

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(screen.queryByText(["missing", "key"].join("."))).not.toBeInTheDocument();
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
        "Could not load tasks. Please try again.",
      );
    });
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "Database connection failed",
    );
    expect(
      screen.getByRole("button", { name: "Dismiss notification" }),
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
        "Could not load tasks. Please try again.",
      );
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("translates Todo API error codes inside the plugin", async () => {
    const todoNotFoundError = Object.assign(new Error("TODO_NOT_FOUND"), {
      code: "TODO_NOT_FOUND",
    });
    const todoApi = {
      getTodos: jest.fn().mockRejectedValue(todoNotFoundError),
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
          locale: "ru",
        }),
      ),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Эта задача больше не существует.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("TODO_NOT_FOUND");
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

    fireEvent.click(screen.getByRole("button", { name: "High" }));

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
