import { ApiClientError } from "./api-client-error";

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const responseText = await response.text();
  let data: unknown;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new ApiClientError(
          response.status,
          "INVALID_RESPONSE",
        );
      }
    }
  }

  if (!response.ok) {
    const errorValue =
      typeof data === "object" && data !== null && "error" in data
        ? data.error
        : null;
    const errorBody =
      typeof errorValue === "object" && errorValue !== null
        ? errorValue
        : null;
    const code =
      errorBody &&
      "code" in errorBody &&
      typeof errorBody.code === "string"
        ? errorBody.code
        : response.status === 401
          ? "SESSION_EXPIRED"
          : response.status === 403
            ? "FORBIDDEN"
            : response.status === 400 || response.status === 422
              ? "VALIDATION_ERROR"
              : response.status === 404
                ? "NOT_FOUND"
                : response.status === 409
                  ? "CONFLICT"
                  : "INTERNAL_ERROR";
    const details =
      errorBody && "details" in errorBody ? errorBody.details : undefined;

    throw new ApiClientError(response.status, code, details);
  }

  return data as T;
}
