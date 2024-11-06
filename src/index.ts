import express, { Request, Response } from "express"; // Import express and the Request and Response types
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
import { PrismaClient } from "@prisma/client";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://climb-harder-backend.vercel.app",
    "https://climb-harderv2.peterforsyth.dev",
  ],
}; // Define CORS options, restricting access to your server from only this specific origin

export const app = express(); // Create an Express application instance
export const prisma = new PrismaClient();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.POSTGRES_PRISMA_URL);
});
