import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Season, User } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import { deleteSeason, getSeasons, newSeason } from "../helpers/seasonsHelper";

export const seasonsRouter = Router();

seasonsRouter.get("/getSeasons", async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);
    const seasons: Season[] = await getSeasons(user.id);

    res.status(200).json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch seasons" });
  }
});

seasonsRouter.post("/newSeason", async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);
    const updatedSeasons: Season[] = await getSeasons(user.id);

    res.status(201).json({ updatedSeasons });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new season" });
  }
});

seasonsRouter.delete("/deleteSeason", async (req: Request, res: Response) => {
  const { seasonId } = req.body;

  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);

    // Retrieve the season to check ownership
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
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
