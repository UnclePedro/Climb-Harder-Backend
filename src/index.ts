import express from "express";
import cors from "cors"; // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
import { workoutsRouter } from "./api/routes/workouts";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://climb-harder-backend.vercel.app",
    "https://climb-harderv2.peterforsyth.dev",
  ],
};

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app

app.use("/", workoutsRouter);

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.POSTGRES_PRISMA_URL);
});
