import { app, prisma } from "../..";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
} from "../helpers/workoutsHelper";
import { Request, Response } from "express";

app.post("/workouts", async (req, res) => {
  const { name, trainingType, details, duration, date, userId, seasonId } =
    req.body;

  try {
    // Fetch the user based on the provided apiKey
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.id !== userId) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the season exists and belongs to the user
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
    });

    if (!season || season.userId !== userId) {
      return res.status(404).json({ error: "Season not found." });
    }

    const newWorkout = await createWorkout(
      name,
      trainingType,
      details,
      duration,
      date,
      userId,
      seasonId
    );
    res.status(200).json({ newWorkout: newWorkout });
  } catch (error) {
    res.status(500).json({ error: "Failed to add workout" });
  }
});

app.delete("/workouts", async (req: Request, res: Response) => {
  await deleteWorkout(req.body.id, req.body.apiKey);
  const updatedWorkouts = await getWorkouts();

  res.status(200).json({
    message: "Workout deleted successfully",
    quotes: updatedWorkouts,
  });
});
