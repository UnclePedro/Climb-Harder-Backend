import { Request, Response, Router } from "express";
import { validateUser } from "../helpers/authenticationHelper";
import { saveSeasonNotes, getSeasonNotes } from "../helpers/seasonNotesHelper";
import { SeasonNotes, User } from "@prisma/client";
import { validateSeasonOwnership } from "../helpers/seasonsHelper";

export const seasonNotesRouter = Router();

seasonNotesRouter.get(
  "/getSeasonNotes",
  async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["apikey"];
      const user = await validateUser(req, res);

      const seasonNotes: SeasonNotes[] = await getSeasonNotes(user.id);

      res.status(200).json(seasonNotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to create new season" });
    }
  }
);

seasonNotesRouter.put(
  "/saveSeasonNotes",
  async (req: Request, res: Response) => {
    const { seasonNotes } = req.body;

    try {
      const apiKey = req.headers["apikey"];
      const user = await validateUser(req, res);
      await validateSeasonOwnership(seasonNotes.seasonId, user.id);

      const updatedSeasonNotes = await saveSeasonNotes(seasonNotes);

      res.status(200).json({
        message: "Season notes updated successfully",
        updatedSeasonNotes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update season notes" });
    }
  }
);
