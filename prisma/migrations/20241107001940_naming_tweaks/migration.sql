/*
  Warnings:

  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Season` table. All the data in the column will be lost.
  - The primary key for the `Workout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Workout` table. All the data in the column will be lost.
  - Made the column `details` on table `Workout` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SeasonNotes" DROP CONSTRAINT "SeasonNotes_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_seasonId_fkey";

-- AlterTable
ALTER TABLE "Season" DROP CONSTRAINT "Season_pkey",
DROP COLUMN "id",
ADD COLUMN     "seasonId" SERIAL NOT NULL,
ADD CONSTRAINT "Season_pkey" PRIMARY KEY ("seasonId");

-- AlterTable
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_pkey",
DROP COLUMN "id",
ADD COLUMN     "workoutId" SERIAL NOT NULL,
ALTER COLUMN "details" SET NOT NULL,
ADD CONSTRAINT "Workout_pkey" PRIMARY KEY ("workoutId");

-- AddForeignKey
ALTER TABLE "SeasonNotes" ADD CONSTRAINT "SeasonNotes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("seasonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("seasonId") ON DELETE CASCADE ON UPDATE CASCADE;
