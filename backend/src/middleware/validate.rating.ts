import type { Request, Response, NextFunction } from "express";
import { createRatingSchema, updateRatingSchema } from "#schemas";

export const validateCreateRating = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createRatingSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid rating data",
      errors: result.error.errors,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateRating = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateRatingSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid rating update data",
      errors: result.error.errors,
    });
    return;
  }

  req.body = result.data;
  next();
};
// TODO errorhandliingf
