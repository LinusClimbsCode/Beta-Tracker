import express from "express";
import cors from "cors";
import { config } from "#config";
import {
  authRouter,
  gymRouter,
  wallRouter,
  colorRouter,
  gradeRouter,
  eventRouter,
  boulderRouter,
  boulderValidationRouter,
  userBoulderRouter,
  ratingRouter,
} from "#routes";
import cookieParser from "cookie-parser";
import { requireAuth } from "#middleware/auth.middleware";
import { errorHandler } from "#middleware/error.middleware";

const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// CORS middleware
app.use(
  cors({
    origin: config.server.frontendUrl || "http://localhost:5173",
    credentials: true, // Allow cookies
  }),
);

// middleware
app.use(express.json());
app.use(cookieParser());

// home testing
app.get("/", (_req, res) => res.send("hello world!"));

// routes
app.use("/auth", authRouter);
app.use("/gym", gymRouter);
app.use("/wall", wallRouter);
app.use("/color", colorRouter);
app.use("/grade", gradeRouter);
app.use("/event", eventRouter);
app.use("/boulder", boulderRouter);
app.use("/validation", boulderValidationRouter);
app.use("/user-boulder", userBoulderRouter);
app.use("/rating", ratingRouter);

// TODO add user route

// test, debug route
app.get("/protected", requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
