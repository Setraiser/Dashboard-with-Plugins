import { prisma } from "@/shared/lib/server";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";

interface IDeleteTodo {
  id: string;
}

export const deleteTodo = authHandler(async (user, { id }: IDeleteTodo) => {
  const result = await prisma.todo.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    throw new Error("Todo not found");
  }

  return new Response(null, { status: 204 });
});
