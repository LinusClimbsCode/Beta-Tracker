import type { Request, Response } from "express";
import {
  validateBoulder,
  getBoulderValidations,
  getUserValidations,
} from "#services";

export const validateBoulderController = async (
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

  const result = await validateBoulder(req.body, req.user.id);

  res.status(201).json({
    success: true,
    validation: result.validation,
    boulder: result.boulder,
    message: result.statusMessage || "Validation recorded successfully",
    stats: result.stats,
  });
};

export const getBoulderValidationsController = async (
  req: Request<{ boulderId: string }>,
  res: Response,
) => {
  const { boulderId } = req.params;

  if (!boulderId) {
    res.status(400).json({
      success: false,
      message: "Boulder ID is required",
    });
    return;
  }

  const validations = await getBoulderValidations(boulderId);

  res.json({
    success: true,
    count: validations.length,
    validations,
  });
};

export const getUserValidationsController = async (
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

  const validations = await getUserValidations(req.user.id);

  res.json({
    success: true,
    count: validations.length,
    validations,
  });
};
