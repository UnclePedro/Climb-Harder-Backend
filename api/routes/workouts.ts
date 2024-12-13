import { Request, Response, Router } from "express";
import { prisma } from "../config/prismaClient";
import { Workout } from "@prisma/client";
import { validateUser } from "../helpers/authenticationHelper";
import {
  deleteWorkout,
  saveWorkout,
  getWorkouts,
  validateWorkoutOwnership,
} from "../helpers/workoutsHelper";

export const workoutsRouter = Router();

workoutsRouter.get("/getWorkouts", async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers["apikey"];
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
    const user = await validateUser(apiKey as string);
    if (workout.id) {
      await validateWorkoutOwnership(workout.id, user.id);
    }

    await saveWorkout(workout);
    const updatedWorkouts: Workout[] = await getWorkouts(user.id);

    res.status(workout.id ? 200 : 201).json({
      message: workout.id
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
    const user = await validateUser(apiKey as string);
    validateWorkoutOwnership(workoutId, user.id);

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
