import type { Request, Response } from "express";
import {
  createBoulder,
  findBoulderById,
  findAllBoulders,
  updateBoulder,
  deleteBoulder,
} from "#services";

export const createBoulderController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  try {
    const boulder = await createBoulder(req.body, req.user.id);
    // TODO error handling any nonono
    res.status(201).json({
      success: true,
      boulder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// TODO BUG if(!id) will never happen
export const getBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({
      success: false,
      message: "No valid Id",
    });
    return;
  }

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
  const { wallId, gymId, setterId, uploadedById, status } = req.query as {
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
  if (!id) {
    res.status(404).json({
      success: false,
      message: "No valid Id",
    });
    return;
  }

  try {
    const boulder = await updateBoulder(id, data);

    res.json({
      success: true,
      boulder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// TODO think about the deletion system, how to prefent from trolls
export const deleteBoulderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({
      success: false,
      message: "No valid Id",
    });
    return;
  }

  await deleteBoulder(id);

  res.json({
    success: true,
    message: "Boulder deleted successfully",
  });
};
