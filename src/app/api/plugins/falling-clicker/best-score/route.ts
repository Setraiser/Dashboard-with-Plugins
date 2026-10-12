import { scoreSubmissionSchema } from "@/plugin-host/falling-clicker";
import { getBestScore } from "@/plugin-host/falling-clicker/server/requests/getBestScore";
import { submitBestScore } from "@/plugin-host/falling-clicker/server/requests/submitBestScore";
import { ApiError } from "@/shared/lib/server/apiHandler/api-error";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";

export async function GET() {
  return apiHandler(async () => ({
    bestScore: await getBestScore({}),
  }));
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const parsed = scoreSubmissionSchema.safeParse(await request.json());
    if (!parsed.success) {
      throw new ApiError(400, "GAME_SCORE_INVALID");
    }

    return {
      bestScore: await submitBestScore(parsed.data),
    };
  });
}
