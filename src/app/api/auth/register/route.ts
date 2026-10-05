import { registerUser } from "@/features/auth/register/server/register";
import { ApiError } from "@/shared/lib/server/apiHandler/api-error";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";
import { z } from "zod";

const registerRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

function isUniqueConstraintError(
  error: unknown,
): error is { code: "P2002" } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const { email, password, name } = registerRequestSchema.parse(
      await request.json(),
    );

    try {
      return await registerUser({ email, password, name });
    } catch (error) {
      if (
        (error instanceof Error && error.message === "USER_ALREADY_EXISTS") ||
        isUniqueConstraintError(error)
      ) {
        throw new ApiError(409, "An account with this email already exists.");
      }

      throw error;
    }
  }, {
    successStatus: 201,
  });
}
