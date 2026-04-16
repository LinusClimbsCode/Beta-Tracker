import type { Request, Response } from "express";
import {
  createBoulder,
  findBoulderById,
  findAllBoulders,
  updateBoulder,
  deleteBoulder,
} from "#services";
import { boulderQuerySchema } from "#schemas";

export const createBoulderController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const boulder = await createBoulder(req.body, req.user.id);
  res.status(201).json({
    success: true,
    boulder,
  });
};

export const getBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const boulder = await findBoulderById(id);

  if (!boulder) {
    res.status(404).json({
      success: false,
      message: "Boulder not found",
    });
    return;
  }

  res.json({
    success: true,
    boulder,
  });
};

export const getAllBouldersController = async (req: Request, res: Response) => {
  const result = boulderQuerySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.issues });
    return;
  }
  const { wallId, gymId, setterId, uploadedById, status } = result.data as {
    wallId?: string;
    gymId?: string;
    setterId?: string;
    uploadedById?: string;
    status?: string;
  };

  const boulders = await findAllBoulders({
    wallId,
    gymId,
    setterId,
    uploadedById,
    status,
  });

  res.json({
    success: true,
    count: boulders.length,
    boulders,
  });
};

export const updateBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const boulder = await updateBoulder(id, data);
  res.json({
    success: true,
    boulder,
  });
};

// TODO think about the deletion system, how to prefent from trolls
export const deleteBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteBoulder(id);

  res.json({
    success: true,
    message: "Boulder deleted successfully",
  });
};
