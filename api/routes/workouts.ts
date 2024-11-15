import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Workout } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import {
  deleteWorkout,
  saveWorkout,
  getWorkouts,
} from "../helpers/workoutsHelper";

export const workoutsRouter = Router();

workoutsRouter.get("/getWorkouts", async (req: Request, res: Response) => {
  const { userId, apiKey } = req.body;
  try {
    await validateUser(userId, apiKey);
    await getWorkouts(userId);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get workouts",
    });
  }
});

workoutsRouter.post("/saveWorkout", async (req: Request, res: Response) => {
  const { workout, userId, apiKey } = req.body;

  try {
    await validateUser(userId, apiKey);

    // If the workout already exists, verify ownership
    if (workout.workoutId) {
      const existingWorkout = await prisma.workout.findUnique({
        where: { workoutId: workout.workoutId },
      });

      if (!existingWorkout || existingWorkout.userId !== userId) {
        return res.status(403).json({
          error: "Unauthorized: You can only update your own workouts",
        });
      }
    }

    // Save the workout (create or update based on workoutId presence)
    await saveWorkout(userId, workout);
    const updatedWorkouts: Workout[] = await getWorkouts(userId);

    res.status(workout.workoutId ? 200 : 201).json({
      message: workout.workoutId
        ? "Workout updated successfully"
        : "Workout created successfully",
      updatedWorkouts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save workout" });
  }
});

workoutsRouter.delete("/deleteWorkout", async (req: Request, res: Response) => {
  const { workoutId, userId, apiKey } = req.body;

  try {
    const user = await validateUser(userId, apiKey);

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
      updatedWorkouts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete workout",
    });
  }
});
