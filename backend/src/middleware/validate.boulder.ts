import type { Request, Response, NextFunction } from "express";
import { createBoulderSchema, updateBoulderSchema } from "#schemas";

export const validateCreateBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = createBoulderSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

export const validateUpdateBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = updateBoulderSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};
// TODO errorhandliingf
