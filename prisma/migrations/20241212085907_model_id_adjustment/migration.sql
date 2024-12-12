/*
  Warnings:

  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seasonId` on the `Season` table. All the data in the column will be lost.
  - The primary key for the `Workout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `workoutId` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SeasonNotes" DROP CONSTRAINT "SeasonNotes_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_seasonId_fkey";

-- AlterTable
ALTER TABLE "Season" DROP CONSTRAINT "Season_pkey",
DROP COLUMN "seasonId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Season_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_pkey",
DROP COLUMN "workoutId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Workout_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "SeasonNotes" ADD CONSTRAINT "SeasonNotes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
