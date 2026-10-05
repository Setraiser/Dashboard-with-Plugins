import { useMemo } from "react";
import { ITodoItem, TodoPriority, TodoStatus } from "../types/types";

export type TodoStatusFilter = "all" | "active" | "completed";
export type TodoPriorityFilter = TodoPriority | null;

interface UseTodoFiltersArgs {
  todos: ITodoItem[];
  statusFilter: TodoStatusFilter;
  priorityFilter: TodoPriorityFilter;
  searchQuery: string;
}

export function useTodoFilters({
  todos,
  statusFilter,
  priorityFilter,
  searchQuery,
}: UseTodoFiltersArgs) {
  return useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesStatus =
        statusFilter === TodoStatus.All ||
        (statusFilter === TodoStatus.Active && !todo.completed) ||
        (statusFilter === TodoStatus.Completed && todo.completed);

      const matchesPriority =
        priorityFilter === null || todo.priority === priorityFilter;

      const matchesSearch =
        !normalizedQuery || todo.text.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [priorityFilter, searchQuery, statusFilter, todos]);
}
