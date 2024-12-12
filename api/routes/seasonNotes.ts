import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { validateUser } from "../helpers/authenticationHelper";
import { editSeasonNotes, getSeasonNotes } from "../helpers/seasonNotesHelper";
import { Season, SeasonNotes, User } from "@prisma/client";

export const seasonNotesRouter = Router();

seasonNotesRouter.get(
  "/getSeasonNotes",
  async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["apikey"];

      if (!apiKey) {
        return res.status(400).json({ error: "Missing apiKey" });
      }

      const user = await validateUser(apiKey as string);
      const seasonNotes: SeasonNotes[] = await getSeasonNotes(user.id);

      res.status(201).json({ seasonNotes });
    } catch (error) {
      res.status(500).json({ error: "Failed to create new season" });
    }
  }
);

seasonNotesRouter.put(
  "/saveSeasonNotes",
  async (req: Request, res: Response) => {
    const { seasonId, updatedSeasonNotesData } = req.body;

    try {
      const apiKey = req.headers["apikey"];

      if (!apiKey) {
        return res.status(400).json({ error: "Missing apiKey" });
      }

      const user = await validateUser(apiKey as string);

      const season = await prisma.season.findUnique({
        where: { seasonId },
      });

      // Check if the season exists and if the user owns it
      if (!season || season.userId !== user.id) {
        return res
          .status(404)
          .json({ error: "Season notes could not be edited" });
      }

      const updatedSeasonNotes = await editSeasonNotes(
        seasonId,
        updatedSeasonNotesData
      );

      res.status(200).json({
        message: "Season notes updated successfully",
        updatedSeasonNotes,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update season notes" });
    }
  }
);
