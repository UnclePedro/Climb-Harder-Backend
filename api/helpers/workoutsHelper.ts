import { prisma } from "../config/prismaClient";
import { TrainingType, Workout } from "@prisma/client";

export const validateWorkoutOwnership = async (
  workoutId: number,
  userId: string
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

export const getWorkouts = async (userId: string) => {
  return await prisma.workout.findMany({
    where: {
      season: {
        userId,
      },
    },
  });
};

export const newWorkout = async (userId: string, seasonId: number) => {
  const lastWorkout = await prisma.workout.findFirst({
    where: {
      seasonId,
      season: {
        userId,
      },
    },
    orderBy: { date: "desc" },
  });

  const newWorkout = await prisma.workout.create({
    data: {
      name: lastWorkout?.name || "Workout Name",
      trainingType: lastWorkout?.trainingType || TrainingType.Base,
      details: "",
      duration: 0,
      date: new Date(),
      seasonId,
    },
  });

  return newWorkout;
};

export const saveWorkout = async (workout: Workout) => {
  // If the workout ID is -1, it's a new workout, so omit the placeholder ID during creation
  if (workout.id === -1) {
    return await prisma.workout.create({
      data: { ...workout, id: undefined }, // Ensure id is not included
    });
  } else {
    // For existing workouts, use upsert
    return await prisma.workout.update({
      where: { id: workout.id },
      data: { ...workout },
    });
  }
};

export const deleteWorkout = async (workoutId: number) => {
  await prisma.workout.delete({
    where: {
      id: workoutId,
    },
  });
};
