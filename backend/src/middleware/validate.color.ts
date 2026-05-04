import type { Request, Response, NextFunction } from "express";
import { createColorSchema, updateColorSchema } from "#schemas";

export const validateCreateColor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createColorSchema.safeParse(req.body);

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

export const validateUpdateColor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateColorSchema.safeParse(req.body);

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
