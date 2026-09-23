import { NextResponse } from "next/server";

import { login } from "@/features/auth/login/server/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await login(body);

    return NextResponse.json(user);
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);

    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
