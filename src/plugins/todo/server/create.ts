import { authHandler } from "@/shared/lib/server/authHandler/authHandler";
import { prisma } from "@/shared/lib/server/prisma/client";
import { TodoPriority, todoSelect } from "../entities/todo";

interface ICreateTodos {
  text: string;
  priority: TodoPriority;
}

export const createTodo = authHandler(
  async (user, { text, priority }: ICreateTodos) => {
    return prisma.todo.create({
      data: {
        text,
        priority,
        userId: user.id,
      },
      select: todoSelect,
    });
  }
);
