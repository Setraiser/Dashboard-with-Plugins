import { prisma } from "@/shared/lib/server/prisma/client";
import { authHandler } from "@/shared/lib/server/authHandler/authHandler";

const GAME_ID = "falling-clicker";

export const submitBestScore = authHandler(async (user, { score }: { score: number }) => {
  const [result] = await prisma.$queryRaw<Array<{ score: number }>>`
    INSERT INTO "GameBestScore" ("userId", "gameId", "score", "createdAt", "updatedAt")
    VALUES (${user.id}, ${GAME_ID}, ${score}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT ("userId", "gameId") DO UPDATE
    SET
      "score" = GREATEST("GameBestScore"."score", EXCLUDED."score"),
      "updatedAt" = CASE
        WHEN EXCLUDED."score" > "GameBestScore"."score" THEN CURRENT_TIMESTAMP
        ELSE "GameBestScore"."updatedAt"
      END
    RETURNING "score"
  `;

  if (!result) {
    throw new Error("Failed to read the saved Falling Clicker score.");
  }

  return result.score;
});
