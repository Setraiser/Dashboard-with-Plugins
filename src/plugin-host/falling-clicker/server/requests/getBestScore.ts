import { prisma } from "@/shared/lib/server/prisma/client";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";

const GAME_ID = "falling-clicker";

export const getBestScore = authHandler(async (user) => {
  const result = await prisma.gameBestScore.findUnique({
    where: {
      userId_gameId: {
        userId: user.id,
        gameId: GAME_ID,
      },
    },
    select: { score: true },
  });

  return result?.score ?? null;
});
