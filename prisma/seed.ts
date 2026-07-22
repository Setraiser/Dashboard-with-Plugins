import { prisma } from "@/shared/lib/server";
import argon2 from "argon2";
import "dotenv/config";

async function main() {
  console.log("🌱 Старт сидинга...");
  const passwordHash = await argon2.hash(process.env.ADMIN_PASSWORD!);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
    },
  });

  await prisma.todo.createMany({
    data: [
      {
        text: "Learn Prisma",
        completed: false,
        userId: admin.id,
      },
      {
        text: "Finish Dashboard",
        completed: true,
        userId: admin.id,
      },
    ],
  });

  console.log("✅ Сидинг успешно завершен!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при сидинге:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
