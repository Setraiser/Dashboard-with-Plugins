import { prisma } from "@/shared/lib/server";
import { verifyPassword } from "@/shared/lib/server/auth/password";
export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    },
  });
  console.log(user, "FIND_USER");
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;

  return safeUser;
}
