import express from "express";
import { prisma } from "../..";
import { TrainingType } from "@prisma/client";

export const getWorkouts = async () => {
  return await prisma.workout.findMany();
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

export const deleteWorkout = async (quoteId: number, apiKey: string) => {
  // Retrieve the quote to check the associated authorId
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { authorId: true }, // Select the authorId based on the quoteId
  });

  // If the quote doesn't exist, throw an error
  if (!quote) {
    throw new Error("Quote not found");
  }

  // Retrieve the user to check the apiKey
  const user = await prisma.user.findUnique({
    where: { id: quote.authorId },
    select: { apiKey: true },
  });

  // If the user doesn't exist or the apiKey does not match, throw an error
  if (!user) {
    throw new Error("User not found");
  }
  if (user.apiKey !== apiKey) {
    throw new Error("Unauthorized: API key does not match");
  }

  // Proceed with deletion if the apiKey matches
  await prisma.workout.delete({
    where: {
      id: quoteId,
    },
  });
};
