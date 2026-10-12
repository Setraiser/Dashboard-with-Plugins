-- Store one best score per user and game.
CREATE TABLE "GameBestScore" (
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameBestScore_pkey" PRIMARY KEY ("userId", "gameId")
);

CREATE INDEX "GameBestScore_gameId_idx" ON "GameBestScore"("gameId");

ALTER TABLE "GameBestScore"
ADD CONSTRAINT "GameBestScore_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
