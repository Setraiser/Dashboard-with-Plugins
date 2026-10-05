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
          "The server returned an invalid response.",
        );
      }
    }
  }

  if (!response.ok) {
    const errorBody =
      typeof data === "object" && data !== null && "error" in data &&
      typeof data.error === "string"
        ? data
        : typeof data === "object" && data !== null && "message" in data &&
            typeof data.message === "string"
          ? data
          : null;

    const message =
      errorBody && "error" in errorBody && typeof errorBody.error === "string"
        ? errorBody.error
        : errorBody && "message" in errorBody &&
            typeof errorBody.message === "string"
          ? errorBody.message
          : `Request failed with status ${response.status}.`;

    const details =
      errorBody && "details" in errorBody ? errorBody.details : undefined;

    throw new ApiClientError(response.status, message, details);
  }

  return data as T;
}
