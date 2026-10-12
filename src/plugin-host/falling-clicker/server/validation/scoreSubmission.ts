import { z } from "zod";

export const scoreSubmissionSchema = z
  .object({
    score: z.number().int().min(0).max(1_000_000),
  })
  .strict();
