/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TodoPriority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "priority" "TodoPriority" NOT NULL DEFAULT 'low';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
