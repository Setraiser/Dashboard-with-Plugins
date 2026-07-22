import { prisma } from "@/shared/lib/server/prisma/client";
import { verifyPassword } from "../auth/password";
import { LoginDto } from "./types";

export async function login({ email, password }: LoginDto) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };
}
