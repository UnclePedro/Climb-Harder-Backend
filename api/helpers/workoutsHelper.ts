import { prisma } from "../config/prismaClient";
import { TrainingType, Workout } from "@prisma/client";

export const validateWorkoutOwnership = async (
  workoutId: number,
  userId: number
) => {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  const season = await prisma.season.findUnique({
    where: { id: workout.seasonId },
  });

  // Check if the season exists and if the user owns it
  if (!season || season.userId !== userId) {
    throw new Error("Workout could not be deleted");
  }
};

export const getWorkouts = async (userId: number) => {
  return await prisma.workout.findMany({
    where: {
      season: {
        userId,
      },
    },
  });
};

export const saveWorkout = async (workout: Workout) => {
  return await prisma.workout.upsert({
    where: { id: workout.id },
    update: { ...workout }, // Update the workout if it exists
    create: { ...workout }, // Create a new workout if it doesn't exist
  });
};

export const deleteWorkout = async (workoutId: number) => {
  await prisma.workout.delete({
    where: {
      id: workoutId,
    },
  });
};
