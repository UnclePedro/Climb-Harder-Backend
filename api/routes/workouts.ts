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
  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);
    const workouts = await getWorkouts(user.id);
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get workouts",
    });
  }
});

workoutsRouter.post("/saveWorkout", async (req: Request, res: Response) => {
  const { workout } = req.body;

  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);

    // If the workout already exists, verify ownership
    if (workout.workoutId) {
      const existingWorkout = await prisma.workout.findUnique({
        where: { workoutId: workout.workoutId },
      });

      if (!existingWorkout || existingWorkout.userId !== user.id) {
        return res.status(403).json({
          error: "Unauthorized: You can only update your own workouts",
        });
      }
    }

    // Save the workout (create or update based on workoutId presence)
    await saveWorkout(user.id, workout);
    const updatedWorkouts: Workout[] = await getWorkouts(user.id);

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
  const { workoutId } = req.body;

  try {
    const apiKey = req.headers["apikey"];

    if (!apiKey) {
      return res.status(400).json({ error: "Missing apiKey" });
    }

    const user = await validateUser(apiKey as string);

    // Retrieve the workout to verify ownership
    const workout = await prisma.workout.findUnique({
      where: { workoutId },
    });

    // Check if the workout exists and if the user owns it
    if (!workout || workout.userId !== user.id) {
      return res.status(404).json({ error: "Workout not found" });
    }

    await deleteWorkout(workoutId);

    const updatedWorkouts: Workout[] = await getWorkouts(user.id);

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
