import type { Request, Response, NextFunction } from "express";
import { createBoulderSchema, updateBoulderSchema } from "#schemas";

export const validateCreateBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createBoulderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid boulder data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateBoulderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid boulder data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
