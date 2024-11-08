import { SeasonNotes } from "@prisma/client";
import { prisma } from "../config/prismaClient";

export const editSeasonNotes = async (
  seasonId: number,
  updatedSeasonNotes: SeasonNotes
) => {
  return await prisma.seasonNotes.update({
    where: { seasonId },
    data: { ...updatedSeasonNotes },
  });
};
