import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body;

  // Пока просто проверка
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Registration successful" },
    { status: 201 }
  );
}
