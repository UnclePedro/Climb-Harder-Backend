import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Season, User } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import { deleteSeason, getSeasons, newSeason } from "../helpers/seasonsHelper";

export const seasonsRouter = Router();

seasonsRouter.post("/getSeasons", async (req: Request, res: Response) => {
  try {
    const { userId, apiKey } = req.body;

    await validateUser(userId, apiKey);
    const seasons: Season[] = await getSeasons(userId);

    res.status(201).json({ seasons });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new season" });
  }
});

seasonsRouter.post("/newSeason", async (req: Request, res: Response) => {
  try {
    const { userId, apiKey } = req.body;

    await validateUser(userId, apiKey);

    await newSeason(userId);
    const updatedSeasons: Season[] = await getSeasons(userId);

    res.status(201).json({ updatedSeasons });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new season" });
  }
});

seasonsRouter.delete("/deleteSeason", async (req: Request, res: Response) => {
  const { userId, apiKey, seasonId } = req.body;

  try {
    await validateUser(userId, apiKey);

    // Retrieve the season to check ownership
    const season = await prisma.season.findUnique({
      where: { seasonId },
    });

    // Check if the authenticated user owns the season
    if (!season || season.userId !== userId) {
      return res.status(403).json({ error: "Season not found" });
    }

    await deleteSeason(seasonId);
    const updatedSeasons: Season[] = await getSeasons(userId);

    res.status(200).json({
      message: "Season deleted successfully",
      seasons: updatedSeasons,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete season",
    });
  }
});
