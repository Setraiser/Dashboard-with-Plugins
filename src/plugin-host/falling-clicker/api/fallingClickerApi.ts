import type { FallingClickerApi } from "@/plugins/falling-clicker";
import { apiClient } from "@/shared/lib/server/apiClient/apiClient";

const bestScoreUrl = "/api/plugins/falling-clicker/best-score";

export const fallingClickerApi: FallingClickerApi = {
  async getBestScore() {
    const result = await apiClient<{ bestScore: number | null }>(bestScoreUrl);
    return result.bestScore;
  },
  async submitScore(score) {
    const result = await apiClient<{ bestScore: number }>(bestScoreUrl, {
      method: "POST",
      body: JSON.stringify({ score }),
    });
    return result.bestScore;
  },
};
