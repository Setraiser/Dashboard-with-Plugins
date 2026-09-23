import "server-only";

import { createSession } from "@/shared/lib/server/auth/session";
import { validateCredentials } from "@/shared/lib/server/auth/validate-credentials";
import { LoginDto } from "./types";

export async function login({ email, password }: LoginDto) {
  const user = await validateCredentials(email, password);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  await createSession(user.id);

  return {
    id: user.id,
    email: user.email,
  };
}
