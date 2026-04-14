import type { Request, Response, NextFunction } from "express";
import { createGradeSchema, updateGradeSchema } from "#schemas";

export const validateCreateGrade = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = createGradeSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

export const validateUpdateGrade = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = updateGradeSchema.parse(req.body);
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
