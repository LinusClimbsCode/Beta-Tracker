import type { Request, Response, NextFunction } from "express";
import { createUserBoulderSchema, updateUserBoulderSchema } from "#schemas";

export const validateCreateUserBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createUserBoulderSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }

  next();
};

export const validateUpdateUserBoulder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateUserBoulderSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }
  next();
};
