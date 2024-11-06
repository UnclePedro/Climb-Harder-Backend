import { app } from "../..";
import { newUser } from "../helpers/authenticationHelper";
import { User } from "../models/User";
import { Request, Response } from "express";

app.post("/authentication", async (req: Request, res: Response) => {
  try {
    const newUserData: User = await newUser(); // Create a new user with an API key
    res.status(201).json({
      message: "User created successfully",
      newUser: newUserData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: backend" });
  }
});
