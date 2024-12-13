/*
  Warnings:

  - You are about to drop the column `userId` on the `SeasonNotes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SeasonNotes" DROP CONSTRAINT "SeasonNotes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- AlterTable
ALTER TABLE "SeasonNotes" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "userId";
