/*
  Warnings:

  - Added the required column `userId` to the `SeasonNotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeasonNotes" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SeasonNotes" ADD CONSTRAINT "SeasonNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
