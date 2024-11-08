import { prisma } from "../config/prismaClient";
import { TrainingType, Workout } from "@prisma/client";

export const getWorkouts = async (userId: number) => {
  return await prisma.workout.findMany({
    where: { userId },
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

export const editWorkout = async (
  workoutId: number,
  updatedWorkout: Workout
) => {
  return await prisma.workout.update({
    where: { workoutId },
    data: { ...updatedWorkout },
  });
};
