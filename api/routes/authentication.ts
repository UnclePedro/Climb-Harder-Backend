import { User } from "@prisma/client";
import { newUser } from "../helpers/authenticationHelper";
import { Request, Response, Router } from "express";

export const authenticationRouter = Router();

authenticationRouter.get(
  "/generateUser",
  async (req: Request, res: Response) => {
    try {
      const newUserData: User = await newUser();
      res.status(201).json({
        message: "User created successfully",
        apiKey: newUserData.apiKey,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);
