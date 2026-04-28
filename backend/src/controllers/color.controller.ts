import type { Request, Response } from "express";
import {
  createColor,
  findColorById,
  findAllColors,
  updateColor,
  deleteColor,
} from "#services";

export const createColorController = async (req: Request, res: Response) => {
  const color = await createColor(req.body);

  res.status(201).json({
    success: true,
    color,
  });
};

export const getColorController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const color = await findColorById(id);

  if (!color) {
    res.status(404).json({
      success: false,
      message: "Color not found",
    });
    return;
  }

  res.json({
    success: true,
    color,
  });
};

export const getAllColorsController = async (req: Request, res: Response) => {
  const colors = await findAllColors();

  res.json({
    success: true,
    count: colors.length,
    colors,
  });
};

export const updateColorController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const data = req.body;

  const color = await updateColor(id, data);

  res.json({
    success: true,
    color,
  });
};

export const deleteColorController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  await deleteColor(id);

  res.json({
    success: true,
    message: "Color deleted successfully",
  });
};
