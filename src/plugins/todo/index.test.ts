import todoPlugin from "./index";

describe("todo plugin lifecycle", () => {
  it("exposes a dispose cleanup hook", () => {
    expect(typeof todoPlugin.dispose).toBe("function");
    expect(() => todoPlugin.dispose?.()).not.toThrow();
  });
});
