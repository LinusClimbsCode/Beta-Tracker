import type { Request, Response, NextFunction } from "express";
import { createColorSchema, updateColorSchema } from "#schemas";

export const validateCreateColor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = createColorSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

export const validateUpdateColor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = updateColorSchema.parse(req.body);
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
