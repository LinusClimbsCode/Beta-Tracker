import { Router } from "express";
import {
  getMeController,
  getUserController,
  updateMeController,
} from "#controllers";
import { requireAuth } from "#middleware";

export const userRouter = Router();

// Protected
userRouter.get("/me", requireAuth, getMeController);

userRouter.patch("/me", requireAuth, updateMeController);

// Puplic
userRouter.get("/:id", getUserController);
