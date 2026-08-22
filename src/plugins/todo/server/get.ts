import { prisma } from "@/shared/lib/server";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";

export const getTodos = authHandler(async (user) => {
  return prisma.todo.findMany({
    where: {
      userId: user.id,
    },
  });
});
