import { registerUser } from "@/features/auth/register/server/register";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { message: "Email, name and password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser({
      email,
      password,
      name,
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    throw error;
  }
}
