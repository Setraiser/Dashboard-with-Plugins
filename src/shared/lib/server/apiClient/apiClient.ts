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
        throw new Error("The server returned an invalid response.");
      }
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "error" in data &&
      typeof data.error === "string"
        ? data.error
        : typeof data === "object" && data !== null && "message" in data &&
            typeof data.message === "string"
          ? data.message
          : `Request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  return data as T;
}
