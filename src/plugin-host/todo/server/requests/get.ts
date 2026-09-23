import { prisma } from "@/shared/lib/server";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";
import { todoSelect } from "../../const/select";

export const getTodos = authHandler(async (user) => {
  return prisma.todo.findMany({
    where: {
      userId: user.id,
    },
    select: todoSelect,
  });
});
