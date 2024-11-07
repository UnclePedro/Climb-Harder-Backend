import { Workout } from "@prisma/client";
import { app, prisma } from "../..";
import { validateUser } from "../helpers/authenticationHelper";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
} from "../helpers/workoutsHelper";
import { Request, Response } from "express";

app.post("/workouts", async (req, res) => {
  const workout: Workout = req.body;

  try {
    // Validate the user using the apiKey
    await validateUser(req.body.apiKey);

    // Fetch the user to verify they exist and to check if the userId matches
    await prisma.user.findUnique({
      where: { id: workout.userId },
    });

    // Check if the season exists and belongs to the user
    const season = await prisma.season.findUnique({
      where: { seasonId: workout.seasonId },
    });

    if (!season || season.userId !== workout.userId) {
      return res
        .status(404)
        .json({ error: "Season not found or does not belong to the user" });
    }

    // Proceed with creating the workout
    const newWorkout = await createWorkout(
      workout.name,
      workout.trainingType,
      workout.details,
      workout.duration,
      workout.date,
      workout.userId,
      workout.seasonId
    );
    res.status(200).json({ newWorkout: newWorkout });
  } catch (error) {
    res.status(500).json({ error: "Failed to add workout" });
  }
});

app.delete("/workouts", async (req: Request, res: Response) => {
  const { workoutId, apiKey, userId } = req.body;

  try {
    await validateUser(apiKey);
    await deleteWorkout(workoutId, userId);

    const updatedWorkouts = await getWorkouts(userId);

    res.status(200).json({
      message: "Workout deleted successfully",
      workouts: updatedWorkouts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete workout",
    });
  }
});

app.get("/workouts", async (req: Request, res: Response) => {
  const { workoutId, apiKey, userId } = req.body;
  try {
    await validateUser(apiKey);
    getWorkouts(userId);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get workouts",
    });
  }
});
