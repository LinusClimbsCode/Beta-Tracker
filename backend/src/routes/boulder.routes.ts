import { Router } from "express";
import {
  createBoulderController,
  getBoulderController,
  getAllBouldersController,
  updateBoulderController,
  deleteBoulderController,
} from "#controllers";
import {
  requireAuth,
  validateCreateBoulder,
  validateUpdateBoulder,
} from "#middleware";

export const boulderRouter = Router();

// Public
boulderRouter.get("/", getAllBouldersController);
boulderRouter.get("/:id", getBoulderController);

// Protected (all authenticated users can create/update/delete)
boulderRouter.post(
  "/:gymId",
  requireAuth,
  validateCreateBoulder,
  createBoulderController,
);
boulderRouter.patch(
  "/:id",
  requireAuth,
  validateUpdateBoulder,
  updateBoulderController,
);
boulderRouter.delete("/:id", requireAuth, deleteBoulderController);
