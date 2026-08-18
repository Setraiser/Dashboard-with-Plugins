import "server-only";

import { createSession } from "@/shared/lib/server/auth/session";
import { prisma } from "@/shared/lib/server/prisma/client";
import argon2 from "argon2";

interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export async function registerUser({ email, password, name }: RegisterDto) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },

    select: {
      id: true,
      email: true,
    },
  });

  await createSession(user.id);

  return user;
}
