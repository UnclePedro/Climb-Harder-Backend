import { prisma } from "../config/prismaClient";
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

export const deleteWorkout = async (workoutId: number) => {
  await prisma.workout.delete({
    where: {
      workoutId: workoutId,
    },
  });
};
