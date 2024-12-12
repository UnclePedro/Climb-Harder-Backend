import { SeasonNotes } from "@prisma/client";
import { prisma } from "../config/prismaClient";

export const getSeasonNotes = async (userId: number) => {
  let seasonNotes = await prisma.seasonNotes.findMany({
    where: { userId },
  });
  return seasonNotes;
};

export const editSeasonNotes = async (
  seasonId: number,
  updatedSeasonNotes: SeasonNotes
) => {
  return await prisma.seasonNotes.update({
    where: { seasonId },
    data: { ...updatedSeasonNotes },
  });
};
