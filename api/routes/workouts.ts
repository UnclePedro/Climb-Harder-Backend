import { Request, Response, Router } from "express";
import { Workout } from "@prisma/client";
import { refreshSession, getUser } from "../helpers/authenticationHelper";
import {
  deleteWorkout,
  saveWorkout,
  getWorkouts,
  validateWorkoutOwnership,
} from "../helpers/workoutsHelper";

export const workoutsRouter = Router();
workoutsRouter.use(refreshSession);

workoutsRouter.get("/getWorkouts", async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
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
    const user = await getUser(req);

    // Only validate ownership if it's an existing workout
    if (workout.id !== -1) {
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
    const user = await getUser(req);
    await validateWorkoutOwnership(workoutId, user.id);
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
