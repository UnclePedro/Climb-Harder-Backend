import { prisma } from "../config/prismaClient";

export const validateSeasonOwnership = async (
  seasonId: number,
  userId: number
) => {
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
  });

  if (!season) {
    throw new Error("Could not find season to delete");
  }
  if (season.userId !== userId) {
    throw new Error("User is not authorized");
  }
};

export const getSeasons = async (userId: number) => {
  let seasons = await prisma.season.findMany({
    where: { userId },
    orderBy: { number: "asc" },
  });
  if (seasons.length === 0) {
    seasons = [await newSeason(userId)];
  }
  return seasons;
};

export const newSeason = async (userId: number) => {
  // Find the last season by userId, ordered by season number in descending order
  const lastSeason = await prisma.season.findFirst({
    where: { userId },
    orderBy: { number: "desc" },
  });

  // Calculate the new season number
  const newSeasonNumber = lastSeason ? lastSeason.number + 1 : 1;

  // Create the new season with an incremented number and formatted name
  const newSeason = await prisma.season.create({
    data: {
      number: newSeasonNumber,
      name: `Season ${newSeasonNumber} - ${new Date().toLocaleString(
        "default",
        { month: "long" }
      )} ${new Date().getFullYear()}`,
      userId,
    },
  });

  return newSeason;
};

export const deleteSeason = async (seasonId: number) => {
  await prisma.season.delete({
    where: { id: seasonId },
  });
};
