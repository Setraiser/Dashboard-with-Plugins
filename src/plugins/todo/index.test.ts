import { render } from "@testing-library/react";
import React from "react";
import { TodoWidgetAdapter } from "./adapter";
import todoPlugin from "./index";

describe("todo plugin lifecycle", () => {
  it("exposes a dispose cleanup hook", () => {
    expect(typeof todoPlugin.dispose).toBe("function");
    expect(() => todoPlugin.dispose?.()).not.toThrow();
  });

  it("renders without a host TanStack Query client", () => {
    const todoApi = {
      getTodos: jest.fn().mockResolvedValue([]),
      createTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodos: jest.fn(),
    };

    expect(() =>
      render(
        React.createElement(TodoWidgetAdapter, {
          pluginDependencies: { todoApi },
          instanceId: "todo-instance-1",
          config: { title: "Todo" },
        })
      )
    ).not.toThrow();
  });
});
