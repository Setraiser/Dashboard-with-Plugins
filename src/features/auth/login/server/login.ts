import "server-only";

import { createSession } from "@/shared/lib/server/auth/session";
import { validateCredentials } from "@/shared/lib/server/auth/validate-credentials";
import { NextResponse } from "next/server";
import { LoginDto } from "./types";

export async function login({ email, password }: LoginDto): Promise<
  | NextResponse<{
      error: string;
    }>
  | NextResponse<{
      id: string;
      email: string;
    }>
> {
  const user = await validateCredentials(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({
    id: user.id,
    email: user.email,
  });
}
