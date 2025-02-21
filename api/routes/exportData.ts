import { Router } from "express";
import { getUser, refreshSession } from "../helpers/authenticationHelper";

import { prisma } from "../config/prismaClient";

export const exportDataRouter = Router();
exportDataRouter.use(refreshSession);

exportDataRouter.get("/export-data", async (req, res) => {
  try {
    const user = await getUser(req);

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        seasons: {
          include: {
            workouts: true,
            seasonNotes: true,
          },
        },
      },
    });

    if (!userData) {
      return res.status(404).json({ error: "User data not found" });
    }

    const headers = [
      "Username",
      "Season Name",
      "Training Focuses",
      "Goals",
      "Achievements",
      "Training Type",
      "Workout Name",
      "Details",
      "Duration (min)",
      "Date",
    ].join(",");

    const rows: string[] = [];

    userData.seasons.forEach((season) => {
      season.workouts.forEach((workout) => {
        rows.push(
          [
            `${user.firstName} ${user.lastName}`,
            season.name,
            season.seasonNotes?.trainingFocuses || "",
            season.seasonNotes?.goals || "",
            season.seasonNotes?.achievements || "",
            workout.trainingType,
            workout.name,
            workout.details,
            workout.duration,
            workout.date.toISOString(),
          ].join(",")
        );
      });
    });

    const csvContent = [headers, ...rows].join("\n");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=climb-harder-data.csv"
    );
    res.setHeader("Content-Type", "text/csv");
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
