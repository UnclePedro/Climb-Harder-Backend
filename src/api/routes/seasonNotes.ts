import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { validateUser } from "../helpers/authenticationHelper";
import { editSeasonNotes } from "../helpers/seasonNotesHelper";

export const seasonNotesRouter = Router();

seasonNotesRouter.put(
  "/editSeasonNotes",
  async (req: Request, res: Response) => {
    const { seasonId, updatedSeasonNotesData, apiKey } = req.body;

    try {
      const user = await validateUser(apiKey);

      // Retrieve the season to verify ownership
      const season = await prisma.season.findUnique({
        where: { seasonId },
      });

      // Check if the season exists and if the user owns it
      if (!season || season.userId !== user.id) {
        return res.status(404).json({ error: "Season not found" });
      }

      const updatedSeasonNotes = await editSeasonNotes(
        seasonId,
        updatedSeasonNotesData
      );

      res
        .status(200)
        .json({
          message: "Season notes updated successfully",
          updatedSeasonNotes,
        });
    } catch (error) {
      res.status(500).json({ error: "Failed to update season notes" });
    }
  }
);
