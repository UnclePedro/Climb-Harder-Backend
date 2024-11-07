import express from "express";
import { prisma } from "../..";
import { TrainingType } from "@prisma/client";
import { validateUser } from "./authenticationHelper";

export const getWorkouts = async (userId: number) => {
  return await prisma.workout.findMany({
    where: { userId: userId },
  });
};

export const createWorkout = async (
  name: string,
  trainingType: TrainingType,
  details: string,
  duration: number,
  date: Date,
  userId: number,
  seasonId: number
) => {
  await prisma.workout.create({
    data: {
      name,
      trainingType,
      details,
      duration,
      date,
      userId,
      seasonId,
    },
  });
};
export const deleteWorkout = async (workoutId: number, userId: number) => {
  // Retrieve the workout to check the associated userId
  const workout = await prisma.workout.findUnique({
    where: { workoutId: workoutId },
    select: { userId: true },
  });

  // If the workout doesn't exist, throw an error
  if (!workout) {
    throw new Error("Workout not found");
  }

  // Verify that the workout belongs to the authenticated user
  if (workout.userId !== userId) {
    throw new Error("Unauthorized: You do not own this workout");
  }

  // Proceed with deletion if the userId matches
  await prisma.workout.delete({
    where: {
      workoutId: workoutId,
    },
  });
};
