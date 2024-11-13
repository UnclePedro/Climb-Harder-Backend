/*
  Warnings:

  - You are about to drop the column `seasonNumber` on the `Season` table. All the data in the column will be lost.
  - Added the required column `name` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "seasonNumber",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL;
