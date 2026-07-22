import { NextResponse } from "next/server";

import { login } from "@/features/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await login(body);

    return NextResponse.json(user);
  } catch (_error) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
}
