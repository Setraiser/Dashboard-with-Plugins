import { prisma } from "@/shared/lib/server/prisma/client";
import { hashPassword } from "../auth/password";
import { RegisterDto } from "../register/types";

export async function registerUser({ email, password, name }: RegisterDto) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });
}
