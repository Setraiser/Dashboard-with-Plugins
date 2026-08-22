import { prisma } from "@/shared/lib/server";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";
import { IUpdateTodoInput } from "../entities/todo";

export const updateTodos = authHandler(
  async (user, todos: IUpdateTodoInput[]) => {
    return prisma.$transaction(
      todos.map(({ id, text, priority, completed }) =>
        prisma.todo.update({
          where: {
            id,
            userId: user.id,
          },
          data: {
            ...(text !== undefined && { text }),
            ...(priority !== undefined && { priority }),
            ...(completed !== undefined && { completed }),
          },
        })
      )
    );
  }
);
