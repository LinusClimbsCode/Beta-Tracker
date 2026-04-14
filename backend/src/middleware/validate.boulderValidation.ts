import type { Request, Response, NextFunction } from "express";
import { createBoulderValidationSchema } from "#schemas";

export const validateBoulderValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = createBoulderValidationSchema.parse(req.body);
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
