import { prisma } from "../helpers/prismaClient";
import { TrainingType, Workout } from "@prisma/client";

export const getWorkouts = async (userId: number) => {
  return await prisma.workout.findMany({
    where: { userId: userId },
  });
};

export const createWorkout = async (workout: Workout) => {
  await prisma.workout.create({
    data: {
      ...workout,
    },
  });
};

export const deleteWorkout = async (workoutId: number, userId: number) => {
  // Retrieve the workout to check the associated userId
  const workout = await prisma.workout.findUnique({
    where: { workoutId: workoutId },
    select: { userId: true },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  if (workout.userId !== userId) {
    throw new Error("Unauthorized: You do not own this workout");
  }

  // Proceed with deletion if the userId's match
  await prisma.workout.delete({
    where: {
      workoutId: workoutId,
    },
  });
};
