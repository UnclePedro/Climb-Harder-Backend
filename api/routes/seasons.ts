import { Request, Response, Router } from "express";
import { Season, User } from "@prisma/client";
import { getUser, refreshSession } from "../helpers/authenticationHelper";
import {
  deleteSeason,
  getSeasons,
  newSeason,
  validateSeasonOwnership,
} from "../helpers/seasonsHelper";

export const seasonsRouter = Router();
seasonsRouter.use(refreshSession);

seasonsRouter.get("/getSeasons", async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
    const seasons: Season[] = await getSeasons(user.id);

    res.status(200).json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch seasons" });
  }
});

seasonsRouter.post("/newSeason", async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
    await newSeason(user.id);
    const updatedSeasons: Season[] = await getSeasons(user.id);

    res.status(201).json(updatedSeasons);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new season" });
  }
});

seasonsRouter.delete("/deleteSeason", async (req: Request, res: Response) => {
  const { seasonId } = req.body;

  try {
    const user = await getUser(req);
    await validateSeasonOwnership(seasonId, user.id);
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
