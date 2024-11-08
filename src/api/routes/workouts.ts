import { Request, Response, Router } from "express";
import { prisma } from "../helpers/prismaClient";
import { Workout } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
} from "../helpers/workoutsHelper";

export const workoutsRouter = Router();

workoutsRouter.post("/createWorkout", async (req, res) => {
  const workout: Workout = req.body;

  try {
    await validateUser(req.body.apiKey);

    // Check user exists and if the userId from workout matches user.id
    await prisma.user.findUnique({
      where: { id: workout.userId },
    });

    // Check if the season exists and belongs to the user
    const season = await prisma.season.findUnique({
      where: { seasonId: workout.seasonId },
    });

    if (!season || season.userId !== workout.userId) {
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
    await validateUser(apiKey);
    await deleteWorkout(workoutId, userId);

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
