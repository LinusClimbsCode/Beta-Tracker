import type { Request, Response, NextFunction } from "express";
import { createGymSchema, updateGymSchema } from "#schemas";

export const validateCreateGym = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createGymSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateGym = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateGymSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
