import type { Request, Response, NextFunction } from "express";
import { createWallSchema, updateWallSchema, wallQuerySchema } from "#schemas";

export const validateCreateWall = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createWallSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid wall data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateWall = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateWallSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid wall update data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateWallQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = wallQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid wall data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
