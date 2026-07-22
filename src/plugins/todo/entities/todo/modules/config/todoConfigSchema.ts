export const todoConfigSchema = {
  parse(input: unknown): { title: string } {
    if (typeof input !== "object" || input === null) {
      throw new Error("Todo plugin config must be an object.");
    }

    const title = (input as Record<string, unknown>).title;
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new Error("Todo plugin config.title must be a non-empty string.");
    }

    return { title };
  },
};
