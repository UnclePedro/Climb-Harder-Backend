import express from "express";
import cors from "cors"; // Import the CORS middleware, which allows server to handle cross-origin requests. Server updates changes without reboot
import { workoutsRouter } from "./routes/workouts";
import { authenticationRouter } from "./routes/authentication";
import { seasonsRouter } from "./routes/seasons";
import { seasonNotesRouter } from "./routes/seasonNotes";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://climb-harder-api.peterforsyth.dev",
    "https://climb-harder.peterforsyth.dev",
  ],
};

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app

app.use("/", authenticationRouter);
app.use("/", seasonsRouter);
app.use("/", seasonNotesRouter);
app.use("/", workoutsRouter);

app.listen(8080, () => {
  console.log("Server is running.");
  console.log("Database URL:", process.env.DATABASE_URL);
});
