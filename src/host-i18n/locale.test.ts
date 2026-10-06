import { defaultLocale, isLocale, resolveLocale } from "./locale";

describe("host locale resolution", () => {
  it("prefers the highest quality supported language", () => {
    expect(resolveLocale("en-US;q=0.8, ru-RU;q=0.9")).toBe("ru");
  });

  it("falls back to English for unsupported or missing preferences", () => {
    expect(resolveLocale("fr-FR, de;q=0.9")).toBe(defaultLocale);
    expect(resolveLocale(null)).toBe("en");
  });

  it("ignores languages explicitly assigned zero quality", () => {
    expect(resolveLocale("ru;q=0, en;q=0.5")).toBe("en");
  });

  it("accepts only supported locale identifiers for persisted preferences", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ru")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});
