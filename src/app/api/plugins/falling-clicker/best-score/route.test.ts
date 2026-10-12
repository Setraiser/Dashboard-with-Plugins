import { GET, POST } from "./route";

const mockGetCurrentUser = jest.requireMock(
  "@/shared/lib/server/auth/current-user",
).getCurrentUser as jest.Mock;

jest.mock("@/shared/lib/server/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/shared/lib/server/prisma/client", () => ({
  prisma: {
    gameBestScore: { findUnique: jest.fn() },
    $queryRaw: jest.fn(),
  },
}));

const prismaMock = jest.requireMock(
  "@/shared/lib/server/prisma/client",
).prisma as {
  gameBestScore: { findUnique: jest.Mock };
  $queryRaw: jest.Mock;
};

function createRequest(body?: unknown): Request {
  return {
    async json() {
      return body;
    },
  } as Request;
}

describe("Falling Clicker best-score API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: "user-a" });
  });

  it("retrieves only the authenticated user's best score", async () => {
    prismaMock.gameBestScore.findUnique.mockResolvedValue({ score: 80 });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ bestScore: 80 });
    expect(prismaMock.gameBestScore.findUnique).toHaveBeenCalledWith({
      where: {
        userId_gameId: { userId: "user-a", gameId: "falling-clicker" },
      },
      select: { score: true },
    });
  });

  it("uses a different authenticated owner for each read", async () => {
    prismaMock.gameBestScore.findUnique
      .mockResolvedValueOnce({ score: 80 })
      .mockResolvedValueOnce({ score: 25 });

    await GET();
    mockGetCurrentUser.mockResolvedValueOnce({ id: "user-b" });
    await GET();

    expect(prismaMock.gameBestScore.findUnique.mock.calls.map(([arg]) =>
      arg.where.userId_gameId.userId,
    )).toEqual(["user-a", "user-b"]);
  });

  it.each([
    { submitted: 25, stored: 80 },
    { submitted: 100, stored: 100 },
  ])(
    "keeps the higher score for submission $submitted",
    async ({ submitted, stored }) => {
      prismaMock.$queryRaw.mockResolvedValue([{ score: stored }]);

      const response = await POST(createRequest({ score: submitted }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ bestScore: stored });
      const [sql, userId, gameId, score] =
        prismaMock.$queryRaw.mock.calls[0] as [
          TemplateStringsArray,
          string,
          string,
          number,
        ];
      expect(sql.join("")).toContain("GREATEST");
      expect(userId).toBe("user-a");
      expect(gameId).toBe("falling-clicker");
      expect(score).toBe(submitted);
    },
  );

  it.each([
    { score: -1 },
    { score: 10.5 },
    { score: 1_000_001 },
    { score: 10, userId: "user-b" },
  ])("rejects invalid submissions: %o", async (body) => {
    const response = await POST(createRequest(body));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "GAME_SCORE_INVALID" },
    });
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated reads and writes", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const getResponse = await GET();
    const postResponse = await POST(createRequest({ score: 10 }));

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
    expect(await postResponse.json()).toEqual({
      error: { code: "SESSION_EXPIRED" },
    });
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });
});
