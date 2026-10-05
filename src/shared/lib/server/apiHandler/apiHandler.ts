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
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Request validation failed.",
          details: error.issues.map(({ path, message }) => ({
            path: path.join("."),
            message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Request body must contain valid JSON." },
        { status: 400 },
      );
    }

    console.error("API request failed:", error);
    return Response.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
