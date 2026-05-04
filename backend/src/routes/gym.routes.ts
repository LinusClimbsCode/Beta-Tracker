import { Router } from "express";
import {
  createGymController,
  getGymController,
  getAllGymsController,
  updateGymController,
  deleteGymController,
} from "#controllers";
import {
  requireAdmin,
  requireAuth,
  validateCreateGym,
  validateUpdateGym,
} from "#middleware";

export const gymRouter = Router();

// Public
gymRouter.get("/", getAllGymsController);
gymRouter.get("/:id", getGymController);

// Protected
gymRouter.post("/", requireAuth, validateCreateGym, createGymController);
gymRouter.patch("/:id", requireAuth, validateUpdateGym, updateGymController);
gymRouter.delete("/:id", requireAdmin, deleteGymController);
