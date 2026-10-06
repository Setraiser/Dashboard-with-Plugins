import { login } from "@/features/auth/login/server/login";
import { ApiError } from "@/shared/lib/server/apiHandler/api-error";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";
import { z } from "zod";

const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = loginRequestSchema.parse(await request.json());

    try {
      return await login(body);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        throw new ApiError(401, "INVALID_CREDENTIALS");
      }

      throw error;
    }
  });
}
