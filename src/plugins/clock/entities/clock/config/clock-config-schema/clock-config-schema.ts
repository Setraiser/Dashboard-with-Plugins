export const clockConfigSchema = {
  parse(input: unknown): { title: string } {
    if (typeof input !== "object" || input === null) {
      throw new Error("Clock plugin config must be an object.");
    }

    const maybeTitle = (input as Record<string, unknown>).title;
    if (typeof maybeTitle !== "string" || maybeTitle.trim().length === 0) {
      throw new Error("Clock plugin config.title must be a non-empty string.");
    }

    return { title: maybeTitle };
  },
};
