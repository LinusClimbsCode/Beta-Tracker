import type { Request, Response } from "express";
import {
  createGym,
  findGymById,
  findAllGyms,
  updateGym,
  deleteGym,
} from "#services";

// bussiness logic
export const createGymController = async (req: Request, res: Response) => {
  const gym = await createGym(req.body);

  res.status(201).json({
    success: true,
    gym,
  });
};

export const getGymController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const gym = await findGymById(id);

  if (!gym) {
    res.status(404).json({
      success: false,
      message: "Gym not found",
    });
    return;
  }

  res.json({
    success: true,
    gym,
  });
};

export const getAllGymsController = async (_req: Request, res: Response) => {
  const gyms = await findAllGyms();

  res.json({
    success: true,
    gyms,
  });
};

export const updateGymController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const data = req.body;

  const gym = await updateGym(id, data);

  res.json({
    success: true,
    gym,
  });
};

export const deleteGymController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  await deleteGym(id);

  res.json({
    success: true,
  });
};
