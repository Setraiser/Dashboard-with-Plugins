import { ZodError } from "zod";
import { ApiError } from "./api-error";

interface ApiHandlerOptions {
  successStatus?: number;
}

export async function apiHandler<T>(
  handler: () => Promise<T | Response>,
  { successStatus = 200 }: ApiHandlerOptions = {},
): Promise<Response> {
  try {
    const data = await handler();

    return data instanceof Response
      ? data
      : Response.json(data, { status: successStatus });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          error: {
            code: error.code,
            ...(error.details !== undefined && { details: error.details }),
          },
        },
        { status: error.status },
      );
    }

    if (error instanceof ZodError) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            details: {
              issues: error.issues.map(({ path, code }) => ({
                path: path.join("."),
                code,
              })),
            },
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: { code: "INVALID_JSON" } }, { status: 400 });
    }

    console.error("API request failed:", error);
    return Response.json({ error: { code: "INTERNAL_ERROR" } }, { status: 500 });
  }
}
