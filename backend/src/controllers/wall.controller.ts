import type { Request, Response } from "express";
import {
  createWall,
  findWallById,
  findAllWalls,
  updateWall,
  deleteWall,
} from "#services";
import { NotFoundError, UnauthorizedError } from "#errors";

export const createWallController = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  const wall = await createWall({ ...req.body, createdById: req.user.id });

  res.status(201).json({
    success: true,
    wall,
  });
};

export const getWallController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const wall = await findWallById(id);

  if (!wall) {
    res.status(404).json({
      success: false,
      message: "Wall not found",
    });
    return;
  }

  res.json({
    success: true,
    wall,
  });
};

export const getAllWallsController = async (req: Request, res: Response) => {
  const { gymId, city, setterId } = req.query as {
    gymId?: string;
    city?: string;
    setterId?: string;
  };

  const walls = await findAllWalls({ gymId, city, setterId });

  res.json({
    success: true,
    count: walls.length,
    walls,
  });
};

export const updateWallController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const data = req.body;

  const wall = await updateWall(id, data);

  res.json({
    success: true,
    wall,
  });
};

export const deleteWallController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  const { id } = req.params;

  await deleteWall(id);

  res.json({
    success: true,
    message: "Wall deleted successfully",
  });
};
