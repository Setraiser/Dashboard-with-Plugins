const errorCodeToKey = {
  TODO_NOT_FOUND: "errors.notFound",
  VALIDATION_ERROR: "errors.validation",
  INTERNAL_ERROR: "errors.generic",
} as const;

export function getTodoErrorKey(error: unknown, fallbackKey: string): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : null;

  switch (code) {
    case "TODO_NOT_FOUND":
      return errorCodeToKey.TODO_NOT_FOUND;
    case "VALIDATION_ERROR":
      return errorCodeToKey.VALIDATION_ERROR;
    case "INTERNAL_ERROR":
      return errorCodeToKey.INTERNAL_ERROR;
    default:
      return fallbackKey;
  }
}
