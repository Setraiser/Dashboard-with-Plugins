import { Prisma } from "@prisma/client";

export const todoSelect = {
  id: true,
  text: true,
  priority: true,
  completed: true,
} satisfies Prisma.TodoSelect;