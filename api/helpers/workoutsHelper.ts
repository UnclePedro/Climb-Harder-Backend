import { prisma } from "../config/prismaClient";
import { TrainingType, Workout } from "@prisma/client";

export const getWorkouts = async (userId: number) => {
  return await prisma.workout.findMany({
    where: { userId },
  });
};

export const saveWorkout = async (userId: number, workout: Workout) => {
  if (workout.workoutId) {
    return await prisma.workout.update({
      where: { workoutId: workout.workoutId },
      data: { ...workout },
    });
  } else {
    return await prisma.workout.create({
      data: {
        ...workout,
        userId,
      },
    });
  }
};

export const deleteWorkout = async (workoutId: number) => {
  await prisma.workout.delete({
    where: {
      workoutId: workoutId,
    },
  });
};
