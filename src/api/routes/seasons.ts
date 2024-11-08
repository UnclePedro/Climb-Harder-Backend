import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Season } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import { deleteSeason, getSeasons, newSeason } from "../helpers/seasonsHelper";

export const seasonsRouter = Router();

seasonsRouter.post("/newSeason", async (req: Request, res: Response) => {
  try {
    const { apiKey, userId } = req.body;

    const user = await validateUser(apiKey);

    // Check if the provided userId in the body matches the authenticated user's id
    if (user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized: User ID mismatch" });
    }

    const addedSeason = await newSeason(user.id);

    res.status(201).json({ addedSeason });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new season" });
  }
});

seasonsRouter.delete("/deleteSeason", async (req: Request, res: Response) => {
  const { apiKey, seasonId } = req.body;

  try {
    const user = await validateUser(apiKey);

    // Retrieve the season to check ownership
    const season = await prisma.season.findUnique({
      where: { seasonId },
    });

    // Check if the authenticated user owns the season
    if (!season || season.userId !== user.id) {
      return res.status(403).json({ error: "Season not found" });
    }

    await deleteSeason(seasonId);

    const updatedSeasons: Season[] = await getSeasons(user.id);

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
