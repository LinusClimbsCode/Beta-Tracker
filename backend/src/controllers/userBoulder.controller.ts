import type { Request, Response } from "express";
import {
  createUserBoulder,
  getUserBoulderById,
  getUserBoulders,
  updateUserBoulder,
  deleteUserBoulder,
} from "#services";

export const createUserBoulderController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const userBoulder = await createUserBoulder(req.body, req.user.id);

  res.status(201).json({
    success: true,
    userBoulder,
  });
};

export const getUserBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userBoulder = await getUserBoulderById(id);

  if (!userBoulder) {
    res.status(404).json({
      success: false,
      message: "UserBoulder record not found",
    });
    return;
  }

  res.json({
    success: true,
    userBoulder,
  });
};

export const getUserBouldersController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const { status, boulderId } = req.query as {
    status?: "project" | "flash" | "top";
    boulderId?: string;
  };

  const userBoulders = await getUserBoulders(req.user.id, {
    status,
    boulderId,
  });

  res.json({
    success: true,
    count: userBoulders.length,
    userBoulders,
  });
};

export const updateUserBoulderController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const { id } = req.params;

  const userBoulder = await updateUserBoulder(id, req.body, req.user.id);

  res.json({
    success: true,
    userBoulder,
  });
};

export const deleteUserBoulderController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const { id } = req.params;

  await deleteUserBoulder(id, req.user.id);

  res.json({
    success: true,
    message: "UserBoulder record deleted successfully",
  });
};
