/*
  Warnings:

  - You are about to drop the `Quote` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('Base', 'Strength', 'Power', 'PowerEndurance', 'Performance');

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_authorId_fkey";

-- DropTable
DROP TABLE "Quote";

-- CreateTable
CREATE TABLE "Season" (
    "userId" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonNotes" (
    "seasonId" INTEGER NOT NULL,
    "trainingFocuses" TEXT,
    "goals" TEXT,
    "achievements" TEXT,

    CONSTRAINT "SeasonNotes_pkey" PRIMARY KEY ("seasonId")
);

-- CreateTable
CREATE TABLE "Workout" (
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trainingType" "TrainingType" NOT NULL,
    "details" TEXT,
    "duration" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonNotes" ADD CONSTRAINT "SeasonNotes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
