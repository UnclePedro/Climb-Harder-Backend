import crypto from "crypto";
import { prisma } from "../config/prismaClient";
import { User } from "@prisma/client";

export const newUser = async () => {
  const apiKey = crypto.randomBytes(5).toString("hex");

  const newUser: User = await prisma.user.create({
    data: {
      apiKey,
    },
  });

  return newUser;
};

export const validateUser = async (userId: number, apiKey: string) => {
  const user = await prisma.user.findUnique({
    where: { apiKey },
  });

  if (!user) {
    throw { status: 401, message: "Unauthorized: Invalid API key" };
  }

  if (user.id !== userId) {
    throw { status: 403, message: "Unauthorized: Invalid user ID" };
  }

  return user;
};
