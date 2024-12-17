-- DropForeignKey
ALTER TABLE "SeasonNotes" DROP CONSTRAINT "SeasonNotes_seasonId_fkey";

-- AddForeignKey
ALTER TABLE "SeasonNotes" ADD CONSTRAINT "SeasonNotes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
