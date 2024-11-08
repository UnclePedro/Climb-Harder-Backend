import crypto from "crypto";
import { prisma } from "../helpers/prismaClient";
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

export const validateUser = async (apiKey: string) => {
  const user = await prisma.user.findUnique({
    where: { apiKey },
  });

  if (!user) {
    throw new Error("Unauthorized: Invalid key");
  }

  return user;
};
