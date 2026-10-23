import { hashPassword, verifyPassword } from "./password";

describe("password verification", () => {
  it("accepts the correct password and rejects invalid ones", async () => {
    const passwordHash = await hashPassword("secret-password");

    await expect(verifyPassword(passwordHash, "secret-password")).resolves.toBe(true);
    await expect(verifyPassword(passwordHash, "wrong-password")).resolves.toBe(false);
  });
});
