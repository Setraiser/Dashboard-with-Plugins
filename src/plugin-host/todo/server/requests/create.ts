import { authHandler } from "@/shared/lib/server/authHandler/authHandler";
import { prisma } from "@/shared/lib/server/prisma/client";
import type { TodoPriority as PrismaTodoPriority } from "@prisma/client";
import { todoSelect } from "../../const/select";

interface ICreateTodos {
  text: string;
  priority: string;
}

const normalizePriority = (priority: string): PrismaTodoPriority => {
  const normalized = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  return normalized as PrismaTodoPriority;
};

export const createTodo = authHandler(
  async (user, { text, priority }: ICreateTodos) => {
    return prisma.todo.create({
      data: {
        text,
        priority: normalizePriority(priority),
        userId: user.id,
      },
      select: todoSelect,
    });
  }
);
