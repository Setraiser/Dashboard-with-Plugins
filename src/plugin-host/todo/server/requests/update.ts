import { IUpdateTodoInput } from "@/plugins/todo";
import { prisma } from "@/shared/lib/server";
import { ApiError } from "@/shared/lib/server/apiHandler/api-error";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";
import { Prisma, type TodoPriority as PrismaTodoPriority } from "@prisma/client";
import { todoSelect } from "../../const/select";

const normalizePriority = (priority: string): PrismaTodoPriority => {
  const normalized = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  return normalized as PrismaTodoPriority;
};

export const updateTodos = authHandler(
  async (user, todos: IUpdateTodoInput[]) => {
    try {
      return await prisma.$transaction(
        todos.map(({ id, text, priority, completed }) =>
          prisma.todo.update({
            where: {
              id,
              userId: user.id,
            },
            select: todoSelect,
            data: {
              ...(text !== undefined && { text }),
              ...(priority !== undefined && {
                priority: normalizePriority(priority),
              }),
              ...(completed !== undefined && { completed }),
            },
          })
        )
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ApiError(404, "TODO_NOT_FOUND");
      }

      throw error;
    }
  }
);
