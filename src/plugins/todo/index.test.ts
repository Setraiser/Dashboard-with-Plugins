import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TodoWidgetAdapter } from "./adapter";
import todoPlugin from "./index";

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
});
