import { SeasonNotes } from "@prisma/client";
import { prisma } from "../config/prismaClient";

export const getSeasonNotes = async (userId: string) => {
  let seasonNotes = await prisma.seasonNotes.findMany({
    where: {
      season: {
        userId,
      },
    },
  });
  return seasonNotes;
};

export const saveSeasonNotes = async (seasonNotesData: SeasonNotes) => {
  if (seasonNotesData.seasonId) {
    return await prisma.seasonNotes.upsert({
      where: { seasonId: seasonNotesData.seasonId },
      update: { ...seasonNotesData },
      create: { ...seasonNotesData },
    });
  } else {
    throw new Error("Could not save season notes.");
  }
};
