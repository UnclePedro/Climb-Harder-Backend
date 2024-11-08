import { prisma } from "../config/prismaClient";

export const getSeasons = async (userId: number) => {
  return await prisma.season.findMany({
    where: { userId: userId },
  });
};

export const newSeason = async (userId: number) => {
  const lastSeason = await prisma.season.findFirst({
    where: { userId },
    orderBy: { seasonNumber: "desc" },
  });

  const newSeason = await prisma.season.create({
    data: {
      seasonNumber: lastSeason ? lastSeason.seasonNumber + 1 : 1,
      userId: userId,
    },
  });

  return newSeason;
};

export const deleteSeason = async (seasonId: number) => {
  await prisma.season.delete({
    where: { seasonId },
  });
};
