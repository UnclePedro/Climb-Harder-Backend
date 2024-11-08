import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Workout } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
} from "../helpers/workoutsHelper";

export const workoutsRouter = Router();

workoutsRouter.post("/createWorkout", async (req: Request, res: Response) => {
  const workout: Workout = req.body;

  try {
    const user = await validateUser(req.body.apiKey);

    // Check if the season exists and belongs to the user
    const season = await prisma.season.findUnique({
      where: { seasonId: workout.seasonId },
    });

    // If the found seasons userId doesn't match the validated user's ID, throw error
    if (!season || season.userId !== user.id) {
      return res.status(404).json({ error: "Season not found" });
    }

    const newWorkout = await createWorkout(workout);
    res.status(200).json({ newWorkout: newWorkout });
  } catch (error) {
    res.status(500).json({ error: "Failed to add workout" });
  }
});

workoutsRouter.delete("/deleteWorkout", async (req: Request, res: Response) => {
  const { workoutId, apiKey, userId } = req.body;

  try {
    const user = await validateUser(apiKey);

    // Retrieve the workout to verify ownership
    const workout = await prisma.workout.findUnique({
      where: { workoutId },
    });

    // Check if the workout exists and if the user owns it
    if (!workout || workout.userId !== user.id) {
      return res.status(404).json({ error: "Workout not found" });
    }

    await deleteWorkout(workoutId);

    const updatedWorkouts: Workout[] = await getWorkouts(userId);

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

workoutsRouter.get("/getWorkouts", async (req: Request, res: Response) => {
  const { apiKey, userId } = req.body;
  try {
    await validateUser(apiKey);
    getWorkouts(userId);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get workouts",
    });
  }
});
